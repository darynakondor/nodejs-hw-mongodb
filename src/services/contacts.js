import Contact from '../models/contactModel.js';

export const getAllContacts = async () => {
    return await Contact.find();
};

export const getContactByIdService = async (id) => {
    return await Contact.findById(id); 
};
