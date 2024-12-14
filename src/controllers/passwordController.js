
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const db = require('../models');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const PasswordController = {
    forgotPassword : async (req, res) => {
  const { email } = req.body;
  try {
    const user = await db.user.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Email không tồn tại.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiration = Date.now() + 3600000;

    user.reset_token = token;
    user.reset_token_expiration = expiration;
    await user.save();
    const resetLink = `http://localhost:5173/reset-password/${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Đặt lại mật khẩu',
      text: `Nhấp vào liên kết sau để đặt lại mật khẩu: ${resetLink}`,
    });

    res.json({ message: 'Email đặt lại mật khẩu đã được gửi.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi yêu cầu đặt lại mật khẩu.' });
  }
},
resetPassword:async (req, res) => {
    const { token, newPassword } = req.body;
  try {
    const user = await db.user.findOne({
      where: {
        reset_token: token,
        reset_token_expiration: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: 'Đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.reset_token = null;
    user.reset_token_expiration = null;
    await user.save();

    res.json({ message: 'Mật khẩu đã được đặt lại thành công.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi đặt lại mật khẩu.' });
  }
}
}

module.exports = PasswordController