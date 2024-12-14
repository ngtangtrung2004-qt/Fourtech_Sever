const nodemailer = require('nodemailer');
const { sendEmailService } = require('../services/emailService.js');
require('dotenv').config();

exports.sendReply = async (req, res) => {
    const { email, message } = req.body;
    try {
    if (!email || !message) {
        return res.status(400).json({
            status: 'error',
            message: 'Email và nội dung tin nhắn là bắt buộc.'
        });
    }
    const response = await sendEmailService(email, message);
    return res.status(200).json({
        status: 'success',
        message: 'Email đã được gửi!',
        data: response
    });
} catch (error) {
    console.error('Lỗi khi gửi email:', error);
    return res.status(500).json({
        status: 'error',
        message: 'Không thể gửi email',
        error: error.message
    });
}
};
