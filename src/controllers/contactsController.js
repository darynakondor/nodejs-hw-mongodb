import { getContactByIdService } from '../services/contacts.js';
import { getAllContacts } from '../services/contacts.js';

export const getContacts = async (req, res) => {
    try {
        const contacts = await getAllContacts();
        res.status(200).json({
            status: 200,
            message: "Successfully found contacts!",
            data: contacts
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Error fetching contacts",
            error: error.message
        });
    }
};

export const getContactById = async (req, res) => {
    const { contactId } = req.params;

    try {
        const contact = await getContactByIdService(contactId);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(200).json({
            status: 200,
            message: `Successfully found contact with id ${contactId}!`,
            data: contact
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error fetching contact',
            error: error.message
        });
    }
};