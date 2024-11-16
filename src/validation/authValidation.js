import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const sendResetPasswordSchema = Joi.object({
    email: Joi.string().email().required()
});

export const setNewPasswordSchema = Joi.object({
    token: Joi.string().required(),
    password: Joi.string().required()
})