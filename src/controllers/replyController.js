const nodemailer = require('nodemailer');
const { sendEmailService } = require('../services/emailService.js');
require('dotenv').config();

exports.sendReply = async (req, res) => {
    //   console.log("sendReply function accessed");
    const { email, message } = req.body;

    // console.log('Email:', email);
    // console.log('Message:', message);

    try {
    // Kiểm tra nếu cả email và message đều có giá trị
    if (!email || !message) {
        return res.status(400).json({
            status: 'error',
            message: 'Email và nội dung tin nhắn là bắt buộc.'
        });
    }

    // Gửi email nếu dữ liệu hợp lệ
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
