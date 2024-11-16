import express from 'express';
import { loginUserController, logoutUserController, refreshSessionController, registerUserController, resetPasswordController, sendResetEmailController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { loginSchema, registerSchema, sendResetPasswordSchema, setNewPasswordSchema } from '../validation/authValidation.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';


const router = express.Router();

router.post('/register', validateBody(registerSchema), ctrlWrapper(registerUserController));
router.post('/login', validateBody(loginSchema), ctrlWrapper(loginUserController));
router.post('/refresh', ctrlWrapper(refreshSessionController)); 
router.post('/logout', ctrlWrapper(logoutUserController));
router.post('/send-reset-email',validateBody(sendResetPasswordSchema), ctrlWrapper(sendResetEmailController));
router.post('/reset-pwd', validateBody(setNewPasswordSchema),ctrlWrapper(resetPasswordController));

export default router;