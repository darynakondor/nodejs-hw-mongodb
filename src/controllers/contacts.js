import { getContactByIdService, getAllContacts, createContact, updateContactService, deleteContactById } from '../services/contacts.js';
import httpErrors from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import mongoose from 'mongoose';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import fs from 'node:fs/promises';
import path from 'node:path';


export const getContacts = async (req, res, next) => {
    try {
        const { page, perPage } = parsePaginationParams(req.query);
        const { sortBy, sortOrder } = parseSortParams(req.query);
        const filter = parseFilterParams(req.query);
        const userId = req.user.id;

        const contacts = await getAllContacts(
{
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId
}
        );

        res.status(200).json({
            status: 200,
            message: "Successfully found contacts!",
            data: {
                data: contacts.contacts, 
                page: contacts.page,
                perPage: contacts.perPage,
                totalItems: contacts.totalItems,
                totalPages: contacts.totalPages,
                hasPreviousPage: contacts.hasPreviousPage,
                hasNextPage: contacts.hasNextPage,
            }
        });
    } catch (error) {
        next(error); 
    }
};

export const getContactById = async (req, res, next) => {

    try {
        const { contactId } = req.params;
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(contactId)) {
            return next(httpErrors(400, 'Invalid ID format'));
        }

        const contact = await getContactByIdService(contactId, userId);

        if (!contact) { 
            throw httpErrors(404, "Contact not found");
        }
        console.log(contact);
        res.status(200).json({
            status: 200,
            message: `Successfully found contact with id ${contactId}!`,
            data: contact
        });
    } catch (error) {
        next(error);
    }
};

export const createContactController = async (req, res, next) => {
    try {
        let photo;
        if (typeof req.file !== 'undefined') {
            if (process.env.ENABLE_CLOUDINARY === 'true') {
              const result = await uploadToCloudinary(req.file.path);
              await fs.unlink(req.file.path);
        
              photo = result.secure_url;
            } else {
              await fs.rename(
                req.file.path,
                path.resolve('src', 'public/avatars', req.file.filename),
              );
        
              photo = `http://localhost:8080/avatars/${req.file.filename}`;
            }
          }
        const { name, phoneNumber, email, isFavourite, contactType } = req.body;
        const userId = req.user.id;
        
        if (!name || !phoneNumber || !contactType) {
            throw httpErrors(400, 'Name, phoneNumber, and contactType are required');
        }

        const newContact = await createContact({ name, phoneNumber, email, isFavourite, contactType, userId, photo });

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
        let photo;
        if (typeof req.file !== 'undefined') {
            if (process.env.ENABLE_CLOUDINARY === 'true') {
              const result = await uploadToCloudinary(req.file.path);
              await fs.unlink(req.file.path);
        
              photo = result.secure_url;
            } else {
              await fs.rename(
                req.file.path,
                path.resolve('src', 'public/avatars', req.file.filename),
              );
        
              photo = `http://localhost:8080/avatars/${req.file.filename}`;
            }
          }
        const { contactId } = req.params;
        const { name, phoneNumber, email, isFavourite, contactType } = req.body;
        const userId = req.user.id;
        var payload = {
            name,phoneNumber,email,isFavourite,contactType
        }
        if (photo) payload.photo = photo;
        const updatedContact = await updateContactService(contactId, payload, userId);

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
      const userId = req.user.id;

      if (!mongoose.Types.ObjectId.isValid(contactId)) {
        return next(httpErrors(400, 'Invalid ID format'));
      }

      const deletedContact = await deleteContactById(contactId, userId);
  
    if (!deletedContact) {
      throw httpErrors(404, 'Contact not found');
    }
  
      res.status(204).send();
    } catch (error) {
      next(error);
    }
}