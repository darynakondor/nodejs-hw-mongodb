import express from 'express';
import { getContacts, getContactById, createContactController, updateContact, deleteContact } from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { createContactSchema, updateContactSchema } from '../validation/contactValidator.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';

const router = express.Router();

router.get('/', ctrlWrapper(getContacts)); 
router.get('/:contactId', ctrlWrapper(getContactById));
router.post('/', validateBody(createContactSchema), ctrlWrapper(createContactController));
router.patch('/:contactId', isValidId, validateBody(updateContactSchema), ctrlWrapper(updateContact));
router.delete('/:contactId', ctrlWrapper(deleteContact));

export default router;
