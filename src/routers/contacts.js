import express from 'express';
import { getContacts, getContactById, createContactController, updateContact, deleteContact } from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { createContactSchema, updateContactSchema } from '../validation/contactValidator.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.use(authenticate); 

router.get('/', ctrlWrapper(getContacts)); 
router.get('/:contactId', isValidId, ctrlWrapper(getContactById));
router.post('/', upload.single('photo'), validateBody(createContactSchema), ctrlWrapper(createContactController));
router.patch('/:contactId',upload.single('photo'), isValidId, validateBody(updateContactSchema), ctrlWrapper(updateContact));
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContact));

export default router;
