import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;

  if (typeof authorization !== 'string') {
    return next(createHttpError(401, 'Please provide access token'));
  }

  const [bearer, accessToken] = authorization.split(' ', 2);

  if (bearer !== 'Bearer' || typeof accessToken !== 'string') {
    return next(createHttpError(401, 'Please provide access token'));
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return next(createHttpError(401, 'User not found'));
    }

    req.user = { id: user._id, name: user.name };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(createHttpError(401, 'Invalid token'));
    } else if (error.name === 'TokenExpiredError') {
      return next(createHttpError(401, 'Access token expired'));
    }
    return next(createHttpError(500, 'An unexpected error occurred'));
  }
};
