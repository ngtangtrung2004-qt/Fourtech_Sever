const nodemailer = require('nodemailer');
require('dotenv').config

export const sendEmailService = async (email, message) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.EMAIL_USERNAME, // sender address
    to: email, // list of receivers
    subject: "Cảm ơn quý khách đã liên hệ tới fourtech", // Subject line
    text: "Cảm ơn quý khách đã liên hệ tới fourtech", // plain text body
    html: message, // html body
  });
}