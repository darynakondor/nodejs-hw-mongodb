import express from 'express';
import { loginUserController, logoutUserController, refreshSessionController, registerUserController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { loginSchema, registerSchema } from '../validation/authValidation.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';


const router = express.Router();

router.post('/register', validateBody(registerSchema), ctrlWrapper(registerUserController));
router.post('/login', validateBody(loginSchema), ctrlWrapper(loginUserController));
router.post('/refresh', ctrlWrapper(refreshSessionController)); 
router.post('/logout', ctrlWrapper(logoutUserController));

export default router;