import bcrypt from 'bcrypt';
import crypto from 'crypto'
import createHttpError from 'http-errors';
import User from '../models/userModel.js';
import Session from '../models/sessionModel.js';

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

  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  const session = new Session({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  });
  await session.save();

  return { accessToken, refreshToken, refreshTokenId: session._id };
}

export const refreshSessionService = async (refreshToken) => {
    const session = await Session.findOne({ refreshToken });
  
    if (!session || session.refreshTokenValidUntil <= new Date()) {
      throw createHttpError(401, 'Invalid or expired refresh token');
    }

    const newAccessToken = crypto.randomBytes(30).toString('base64');
    const newRefreshToken = crypto.randomBytes(30).toString('base64');
  
    session.accessToken = newAccessToken;
    session.refreshToken = newRefreshToken;
    session.accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
    session.refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await session.save();
  
    return { accessToken: newAccessToken, newRefreshToken, refreshTokenId: session._id };
};

export const logoutUserService = async (sessionId, refreshToken) => {
    await Session.findOneAndDelete({ _id: sessionId, refreshToken });
};