// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const replyController = require('../controllers/replyController');

router.post('/contact', contactController.createContact); // API tạo phản hồi
router.get('/contact', contactController.getContacts);    // API lấy danh sách phản hồi
router.post('/reply', replyController.sendReply);            // API gửi email trả lời

module.exports = router;