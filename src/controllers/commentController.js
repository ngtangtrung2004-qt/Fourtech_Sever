const db = require("../models");

const CommentController = {
  getComment: async (req, res) => {
    const { product_id } = req.params; // Lấy trực tiếp từ params
    console.log("id", product_id); // Kiểm tra giá trị product_id trong console

    try {
      const comments = await db.review.findAll({
        where: { product_id },
        include: [
          {
            model: db.user, // Kết nối bảng `user`
            as: "userData", // Alias (nên khớp với định nghĩa trong model)
            attributes: ["id", "full_name"], // Chỉ lấy các cột cần thiết
          },
        ],
      });

      res.status(200).json(comments); // Trả về danh sách bình luận
    } catch (error) {
      console.error("Lỗi khi lấy bình luận:", error); // Log lỗi để dễ debug
      res.status(500).json({ message: "Lỗi khi lấy bình luận", error });
    }
  },
  postComment: async (req, res) => {
    const { product_id } = req.params; // Lấy product_id từ URL
    const { content, rating } = req.body; // Lấy dữ liệu từ client
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
        user_id:user_id,
      });
      const user = await db.user.findByPk(user_id, {
        attributes: ["id", "full_name"], // Chỉ lấy các thông tin cần thiết
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
        userData: {
          id: user.id,
          full_name: user.full_name
        },
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
};

module.exports = CommentController;
