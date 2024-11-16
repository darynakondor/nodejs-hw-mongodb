import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(20).required().messages({
      'string.base': `name must be a string`,
      'string.min': `"name" should have a minimum length of 3`,
      'string.max': `"name" should have a maximum length of 20`,
      'any.required': `"name" is a required field`,
    }),
    phoneNumber: Joi.string().min(3).max(20).required().messages({
      'string.base': `phoneNumber must be a string`,
      'string.min': `"phoneNumber" should have a minimum length of 3`,
      'string.max': `"phoneNumber" should have a maximum length of 20`,
      'any.required': `"phoneNumber" is a required field`,
    }),
    email: Joi.string().email().min(3).max(20).optional().messages({
      'string.base': `email must be a string`,
      'string.email': `"email" should be a valid email address`,
      'string.min': `"email" should have a minimum length of 3`,
      'string.max': `"email" should have a maximum length of 20`,
    }),
    isFavourite: Joi.boolean().optional(),
    contactType: Joi.string().valid('work', 'home', 'personal').required().messages({
      'any.only': `"contactType" must be one of [work, home, personal]`,
      'any.required': `"contactType" is a required field`,
    }),
});

export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(20).optional(),
    phoneNumber: Joi.string().min(3).max(20).optional(),
    email: Joi.string().email().min(3).max(20).optional(),
    isFavourite: Joi.boolean().optional(),
    contactType: Joi.string().valid('work', 'home', 'personal').optional(),
});