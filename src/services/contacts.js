import Contact from '../models/contactModel.js';

export const getAllContacts = async ({
    page = 1,
    perPage = 10,
    sortBy = 'name', 
    sortOrder = 'asc',
    filter = {},
    userId
  }) => {
    const skip = page > 0 ? (page - 1) * perPage : 0;
  
    const contactQuery = Contact.find({userId});
  
    if (typeof filter.contactType !== 'undefined') {
      contactQuery.where('contactType').equals(filter.contactType);
    }

    if (typeof filter.isFavourite !== 'undefined') {
      contactQuery.where('isFavourite').equals(filter.isFavourite);
    }
  
    const [total, contacts] = await Promise.all([
      Contact.countDocuments(contactQuery),
      contactQuery
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 }) 
        .skip(skip)
        .limit(perPage),
    ]);
  
    const totalPages = Math.ceil(total / perPage);
  
    return {
      contacts,
      page,
      perPage,
      totalItems: total,
      totalPages,
      hasNextPage: totalPages > page,
      hasPreviousPage: page > 1,
    };
};
  

export const getContactByIdService = async (id, userId) => {
    return await Contact.findOne({_id: id, userId}); 
};

export const createContact = async (contactData) => {
    const newContact = new Contact(contactData);
    return await newContact.save();
};

export const updateContactService = async (contactId, updateData, userId) => {
    const updatedContact = await Contact.findByIdAndUpdate(contactId, updateData, {
        new: true
    });
    
    return updatedContact;
};

export async function deleteContactById(contactId) {
    const contact = await Contact.findAndDelete({_id: contactId, userId});
    return contact;
}
