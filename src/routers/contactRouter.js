// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const replyController = require('../controllers/replyController');
const { checkUserJWT } = require('../middleware/jwtAction');
// router.all('*', checkUserJWT)

router.post('/contact', contactController.createContact); // API tạo phản hồi
router.get('/contact', contactController.getContacts);    // API lấy danh sách phản hồi
router.post('/reply', replyController.sendReply);            // API gửi email trả lời
router.delete('/contact/:id', contactController.deleteContact);            

module.exports = router;