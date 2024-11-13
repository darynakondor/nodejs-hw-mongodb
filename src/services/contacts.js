import Contact from '../models/contactModel.js';

export const getAllContacts = async () => {
    return await Contact.find();
};

export const getContactByIdService = async (id) => {
    return await Contact.findById(id); 
};

export const createContact = async (contactData) => {
    const newContact = new Contact(contactData);
    return await newContact.save();
};

export const updateContactService = async (contactId, updateData) => {
    const updatedContact = await Contact.findByIdAndUpdate(contactId, updateData, {
        new: true
    });
    
    return updatedContact;
};

export async function deleteContactById(contactId) {
    const contact = await Contact.findByIdAndDelete(contactId);
    return contact;
}
