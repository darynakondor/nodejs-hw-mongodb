import bcrypt from 'bcrypt';
import crypto from 'crypto'
import createHttpError from 'http-errors';
import User from '../models/userModel.js';
import Session from '../models/sessionModel.js';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import fs from 'node:fs';
import path from 'node:path';

import { sendMail } from '../utils/sendMail.js';

const RESET_PASSWORD_TEMPLATE = fs.readFileSync(
    path.resolve('src/templates/reset-password.hbs'),
    { encoding: 'utf-8' },
  );

export const registerUserService = async ({ name, email, password }) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createHttpError(409, 'Email in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    return {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    };
};

export const loginUserService = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw createHttpError(401, 'Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw createHttpError(401, 'Invalid email or password');
    }

    await Session.findOneAndDelete({ userId: user._id });

    const accessToken = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' });

    const refreshToken = crypto.randomBytes(30).toString('base64');

    const session = new Session({
        userId: user._id,
        refreshToken,
        refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });
    await session.save();

    return { accessToken, refreshToken, refreshTokenId: session._id };
};

export const refreshSessionService = async (refreshToken) => {
    const session = await Session.findOne({ refreshToken });

    if (!session || session.refreshTokenValidUntil <= new Date()) {
        throw createHttpError(401, 'Invalid or expired refresh token');
    }

    const user = await User.findById(session.userId);
    const newAccessToken = jwt.sign({ userId: session.userId, email: user.email}, process.env.JWT_SECRET, { expiresIn: '15m' });

    const newRefreshToken = crypto.randomBytes(30).toString('base64');

    session.refreshToken = newRefreshToken;
    session.refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await session.save();

    return { accessToken: newAccessToken, newRefreshToken, refreshTokenId: session._id };
};

export const logoutUserService = async (sessionId, refreshToken) => {
    await Session.findOneAndDelete({ _id: sessionId, refreshToken });
};
export const requestResetPassword = async(email) => {
    const user = await User.findOne({ email });
  
    if (user === null) {
      throw createHttpError(404, 'User not found!');
    }
  
    const resetToken = jwt.sign({ sub: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' });
  
    const html = handlebars.compile(RESET_PASSWORD_TEMPLATE);
  
    try {
      await sendMail({
        from: 'condordaryna@gmail.com',
        to: email,
        subject: 'Reset your password',
        html: html({ resetToken }),
      });
    } catch (error) {
      console.error(error);
  
      throw createHttpError(500, 'Failed to send the email, please try again later.');
    }
  }
  export async function resetPassword(password, token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      const user = await User.findOne({ _id: decoded.sub, email: decoded.email });
  
      if (user === null) {
        throw createHttpError(404, 'User not found');
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      await User.findByIdAndUpdate(user._id, { password: hashedPassword });
    } catch (error) {
      if (
        error.name === 'JsonWebTokenError' ||
        error.name === 'TokenExpiredError'
      ) {
        throw createHttpError(401, 'Token error');
      }
  
      throw error;
    }
  }