const nodemailer = require('nodemailer');
require('dotenv').config

export const sendEmailService = async (email, message) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: "Cảm ơn quý khách đã liên hệ tới fourtech",
    text: "Cảm ơn quý khách đã liên hệ tới fourtech",
    html: message,
  });
}