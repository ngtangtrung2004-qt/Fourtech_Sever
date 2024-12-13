// controllers/feedbackController.js
const db = require("../models");
const { Contact } = require("../models");
const { sendEmailService } = require("../services/emailService");

// API để tạo phản hồi mới
const contactController ={
  createContact :async (req, res) => {
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
      res.status(500).json({ message: "Không thể tạo phản hồi", error });
    }
  },
  // API để lấy danh sách phản hồi
  getContacts : async (req, res) => {
    try {
      const contacts = await Contact.findAll();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Không thể lấy phản hồi", error });
    }
  },
  
  deleteContact : async (req, res) => {
    const { id } = req.params;
  
    try {
      const contact = await await db.Contact.findOne({
        where: {
          id: id,
        },
      }); // Tìm liên hệ theo ID
      if (!contact) {
        return res.status(404).json({
          message: "Không tìm thấy liên hệ!",
          EC: 1,
          data: null,
        });
      }
  
      await contact.destroy(); // Xóa liên hệ
      return res.status(200).json({
        message: "Xóa liên hệ thành công!",
        EC: 0,
        data: null,
      });
    } catch (error) {
      console.error("Lỗi khi xóa liên hệ:", error);
      return res.status(500).json({
        message: "Có lỗi xảy ra, vui lòng thử lại sau.",
        EC: -1,
        data: null,
      });
    }
  },
  sendReplyContact : async (req, res) => {
      const { email, message } = req.body
  
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
  },
  updateContactStatus : async (req, res) => {
    const { id } = req.params;
    const { isReplied } = req.body;
    try {
      // Cập nhật trạng thái isReplied trong cơ sở dữ liệu
      const result = await db.Contact.update({ isReplied }, { where: { id:id } });
      console.log(result)
  
      if (result[0] === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Không tìm thấy liên hệ.',
        });
      }
  
      return res.status(200).json({
        status: 'success',
        message: 'Trạng thái liên hệ đã được cập nhật.',
      });
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái liên hệ:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Không thể cập nhật trạng thái liên hệ.',
      });
    }
  }
}

module.exports = contactController;