import { getContactByIdService, getAllContacts, createContact, updateContactService, deleteContactById } from '../services/contacts.js';
import httpErrors from 'http-errors';

export const getContacts = async (req, res, next) => {
    try {
        const contacts = await getAllContacts();

        res.status(200).json({
            status: 200,
            message: "Successfully found contacts!",
            data: contacts
        });
    } catch (error) {
        next(error); 
    }
};

export const getContactById = async (req, res, next) => {

    try {
        const { contactId } = req.params;
        const contact = await getContactByIdService(contactId);

        if (!contact) { 
            throw httpErrors(404, "Contact not found");
        }

        res.status(200).json({
            status: 200,
            message: `Successfully found contact with id ${contactId}!`,
            data: contact
        });
    } catch (error) {
        console.log("error");
        next(error); 
    }
};

export const createContactController = async (req, res, next) => {
    try {
        const { name, phoneNumber, email, isFavourite, contactType } = req.body;
        
        if (!name || !phoneNumber || !contactType) {
            throw httpErrors(400, 'Name, phoneNumber, and contactType are required');
        }

        const newContact = await createContact({ name, phoneNumber, email, isFavourite, contactType });

        res.status(201).json({
            status: 201,
            message: "Successfully created a contact!",
            data: newContact,
        });
    } catch (err) {
        next(err);
    }
};

export const updateContact = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const { name, phoneNumber, email, isFavourite, contactType } = req.body;
        const updatedContact = await updateContactService(contactId, { name, phoneNumber, email, isFavourite, contactType });

        if (!updatedContact) {
            throw httpErrors(404, "Contact not found");
        }

        res.status(200).json({
            status: 200,
            message: "Successfully patched a contact!",
            data: updatedContact
        });
    } catch (err) {
        next(err); 
    }
};

export const deleteContact = async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const deletedContact = await deleteContactById(contactId);
  
    if (!deletedContact) {
      throw httpErrors(404, 'Contact not found');
    }
  
      res.status(204).send();
    } catch (error) {
      next(error);
    }
}