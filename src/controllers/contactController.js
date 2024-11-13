// controllers/feedbackController.js
const { Contact } = require('../models');

// API để tạo phản hồi mới
exports.createContact = async (req, res) => {
    try {
        // console.log(req.body);
        const contact = await Contact.create({
            UserContact: req.body.name,
            EmailContact: req.body.email,
            PhoneContact: req.body.phone,
            messageContact: req.body.message,
        });
        res.status(201).json(contact);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Không thể tạo phản hồi', error });
    }
};

// API để lấy danh sách phản hồi
exports.getContacts = async (req, res) => {
    try {
        const contacts = await Contact.findAll();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Không thể lấy phản hồi', error });
    }
};
