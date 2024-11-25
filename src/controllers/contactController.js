// controllers/feedbackController.js
const db = require("../models");
const { Contact } = require("../models");

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
    res.status(500).json({ message: "Không thể tạo phản hồi", error });
  }
};

// API để lấy danh sách phản hồi
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.findAll();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Không thể lấy phản hồi", error });
  }
};

exports.deleteContact = async (req, res) => {
  const { id } = req.params;
  console.log(id);

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
};
