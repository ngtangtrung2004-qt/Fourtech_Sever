const { where } = require("sequelize");
const db = require("../models");

const CommentController = {
  getAllComment: async (req, res) => {
    try {
      const comments = await db.review.findAll({
        include: [
          {
            model: db.user,
            as: "userData",
            attributes: ["id", "full_name", "role"],
          },
          {
            model: db.product,
            as: "productData",
            attributes: ["id", "name", 'deleted_at'],
            where: { deleted_at: null }
          },
        ],
        order: [["updatedAt", "DESC"]],
      });
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Không thể lấy Bình luận", error });
    }
  },
  getComment: async (req, res) => {
    const { product_id } = req.params; // Lấy product_id từ params
    const { page = 1, limit = 5 } = req.query; // Lấy page và limit từ query params
    const offset = (page - 1) * limit; // Tính offset cho phân trang

    try {
      // Lấy danh sách bình luận cha
      const { count, rows } = await db.review.findAndCountAll({
        where: { product_id, parent_comment_id: null }, // Bình luận gốc
        include: [
          {
            model: db.user, // Kết nối với bảng user
            as: "userData", // Alias cho mối quan hệ
            attributes: ["id", "full_name", "role"], // Lấy các cột cần thiết
          },
          {
            model: db.review, // Bao gồm phản hồi (bình luận con)
            as: "replies",
            include: [
              {
                model: db.user, // Kết nối user cho phản hồi
                as: "userData",
                attributes: ["id", "full_name", "role"],
              },
            ],
          },
        ],
        limit: parseInt(limit), // Số lượng bình luận mỗi trang
        offset: parseInt(offset), // Vị trí bắt đầu
        order: [["updatedAt", "DESC"]], // Sắp xếp theo thời gian cập nhật
      });

      // Trả về kết quả
      res.status(200).json({
        total: count, // Tổng số bình luận gốc
        page: parseInt(page), // Trang hiện tại
        limit: parseInt(limit), // Số lượng bình luận mỗi trang
        totalPages: Math.ceil(count / limit), // Tổng số trang
        comments: rows, // Danh sách bình luận
      });
    } catch (error) {
      console.error("Lỗi khi lấy bình luận:", error); // Log lỗi để debug
      res.status(500).json({ message: "Lỗi khi lấy bình luận", error });
    }
  },
  postComment: async (req, res) => {
    const { product_id } = req.params; // Lấy product_id từ URL
    const { content, rating, parent_comment_id } = req.body; // Lấy dữ liệu từ client
    const user_id = req.user?.id; // Lấy user_id từ token
    if (!user_id) {
      return res.status(401).json({
        message: "Bạn phải đăng nhập để bình luận.",
      });
    }

    try {
      const newComment = await db.review.create({
        content,
        rating,
        product_id,
        user_id: user_id,
        parent_comment_id: parent_comment_id || null, // Nếu không có, mặc định là null
      });
      const user = await db.user.findByPk(user_id, {
        attributes: ["id", "full_name", "role"], // Chỉ lấy các thông tin cần thiết
      });

      if (!user) {
        return res.status(404).json({
          message: "Người dùng không tồn tại.",
        });
      }

      // Chuẩn bị dữ liệu phản hồi
      const responseComment = {
        id: newComment.id,
        content: newComment.content,
        rating: newComment.rating,
        product_id: newComment.product_id,
        user_id: newComment.user_id,
        updatedAt: newComment.updatedAt,
        parent_comment_id: newComment.parent_comment_id,
        userData: {
          id: user.id,
          full_name: user.role === "admin" ? "Admin" : user.full_name,
          role: user.role,
        },
        replies: [],
      };

      // Trả về phản hồi
      return res.status(201).json({
        message: "Thêm bình luận thành công!",
        comment: responseComment,
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi thêm bình luận", error });
    }
  },
  deleteComment: async (req, res) => {
    const { id } = req.params;
    console.log(id);

    try {
      const comment = await await db.review.findOne({
        where: {
          id: id,
        },
      }); // Tìm liên hệ theo ID
      if (!comment) {
        return res.status(404).json({
          message: "Không tìm thấy bình luận!",
          EC: 1,
          data: null,
        });
      }

      await comment.destroy({
        where: { id: id },
        force: true, // Xóa vĩnh viễn
      });
      return res.status(200).json({
        message: "Xóa Bình luận thành công!",
        EC: 0,
        data: null,
      });
    } catch (error) {
      console.error("Lỗi khi xóa Bình luận:", error);
      return res.status(500).json({
        message: "Có lỗi xảy ra, vui lòng thử lại sau.",
        EC: -1,
        data: null,
      });
    }
  },
};

module.exports = CommentController;
