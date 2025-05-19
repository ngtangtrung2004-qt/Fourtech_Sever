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
    const { product_id } = req.params;
    const { page = 1, limit = 5 } = req.query;
    const offset = (page - 1) * limit;

    try {
      const { count, rows } = await db.review.findAndCountAll({
        where: { product_id, parent_comment_id: null },
        include: [
          {
            model: db.user,
            as: "userData",
            attributes: ["id", "full_name", "role"],
          },
          {
            model: db.review,
            as: "replies",
            include: [
              {
                model: db.user,
                as: "userData",
                attributes: ["id", "full_name", "role"],
              },
            ],
          },
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["updatedAt", "DESC"]],
      });

      res.status(200).json({
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
        comments: rows,
      });
    } catch (error) {
      console.error("Lỗi khi lấy bình luận:", error);
      res.status(500).json({ message: "Lỗi khi lấy bình luận", error });
    }
  },
  postComment: async (req, res) => {
    const { product_id } = req.params;
    const { content, rating, parent_comment_id } = req.body;
    const user_id = req.user?.id;
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
        parent_comment_id: parent_comment_id || null,
      });
      const user = await db.user.findByPk(user_id, {
        attributes: ["id", "full_name", "role"],
      });

      if (!user) {
        return res.status(404).json({
          message: "Người dùng không tồn tại.",
        });
      }
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
      });
      if (!comment) {
        return res.status(404).json({
          message: "Không tìm thấy bình luận!",
          EC: 1,
          data: null,
        });
      }

      await comment.destroy({
        where: { id: id },
        force: true,
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
