import { isValidObjectId } from 'mongoose';
import createHttpErrors from 'http-errors';

export function isValidId(req, res, next) {
  const { contactId } = req.params;

  if (isValidObjectId(contactId) !== true) {
    return next(createHttpErrors(400, 'ID is not valid'));
  }

  next();
}