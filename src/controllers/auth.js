import createHttpError from "http-errors";
import { loginUserService, logoutUserService, refreshSessionService, registerUserService, requestResetPassword, resetPassword } from "../services/auth.js";
const isProduction = process.env.PRODUCTION;
export const registerUserController = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
    
        if (!name || !email || !password) {
          throw createHttpError(400, 'All fields are required');
        }
    
        const newUser = await registerUserService({ name, email, password });
    
        res.status(201).json({
          status: 201,
          message: 'Successfully registered a user!',
          data: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt
          }
        });
      } catch (error) {
        next(error);
    }
}

export const loginUserController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
    
        if (!email || !password) {
          throw createHttpError(400, 'Email and password are required');
        }
    
        const { accessToken, refreshToken, refreshTokenId } = await loginUserService({ email, password });
    
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: isProduction == true,
          sameSite: 'Strict',
          maxAge: 30 * 24 * 60 * 60 * 1000
        });
        res.cookie('refreshTokenId', refreshTokenId, {
            httpOnly: true,
            secure: isProduction == true,
            sameSite: 'Strict',
            maxAge: 30 * 24 * 60 * 60 * 1000
          });
    
        res.status(200).json({
          status: 200,
          message: 'Successfully logged in an user!',
          data: {
            accessToken
          }
        });
      } catch (error) {
        next(error);
    }
}

export const refreshSessionController = async (req, res, next) => {
    try {

      const { refreshToken } = req.cookies;
        console.log("refreshToken", refreshToken);
      if (!refreshToken) {
        throw createHttpError(400, 'No refresh token found');
      }
  
      const { accessToken, newRefreshToken, refreshTokenId } = await refreshSessionService(refreshToken);
  
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: isProduction == true,
        sameSite: 'Strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      res.cookie('refreshTokenId', refreshTokenId, {
        httpOnly: true,
        secure: isProduction == true,
        sameSite: 'Strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
  
      res.status(200).json({
        status: 200,
        message: 'Successfully refreshed a session!',
        data: {
          accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
};

export const logoutUserController = async (req, res, next) => {
    try {
      const { refreshToken,refreshTokenId } = req.cookies; 
  
      if (!refreshTokenId || !refreshToken) {
        throw createHttpError(400, 'Session ID and refresh token are required');
      }
  
      await logoutUserService(refreshTokenId, refreshToken);
  
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: isProduction == true,
        sameSite: 'Strict',
      });
      res.clearCookie('refreshTokenId', {
        httpOnly: true,
        secure: isProduction == true,
        sameSite: 'Strict',
      });
  
      res.status(204).send();
    } catch (error) {
      next(error);
    }
};
export const sendResetEmailController = async (req, res, next) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            throw createHttpError(400, 'Session ID and refresh token are required');
        }

        await requestResetPassword(email);
        res.status(200).json({
            status: 200,
       message: "Reset password email has been successfully sent.",
       data: {}
        })
    } catch (error) {
        next(error);
    }
}
export const resetPasswordController = async (req,res,next) => {
    try {
        const { token, password } = req.body;
        await resetPassword(password, token);
        res.status(200).json({status: 200,
            message: "Password has been successfully reset.",
            data: {}})
    } catch( error) {
        next(error);
    }
}