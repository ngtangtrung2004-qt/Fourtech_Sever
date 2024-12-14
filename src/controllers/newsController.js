const db = require("../models");
import { deleteImage } from "../middleware/multer";

const NewsController = {
  getAllNews: async (req, res) => {
    try {

      const news = await db.News.findAll();
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Không thể lấy phản hồi", error });
    }
  },
  getOneNews: async (req, res) => {
    const idNews = req.params.id;

    if (!idNews || isNaN(idNews)) {
      return res.status(400).json({
        message: "ID bản tin không hợp lệ.",
        EC: -1,
        data: null,
      });
    }

    try {
      const news = await db.News.findOne({
        where: { id: parseInt(idNews) },
        attributes: [
          "id",
          "title",
          "content",
          "image",
          "createdAt",
          "updatedAt",
        ],
      });

      if (!news) {
        return res.status(404).json({
          message: "Bản tin không tồn tại.",
          EC: 1,
          data: null,
        });
      }

      return res.status(200).json({
        message: "Lấy chi tiết bản tin thành công.",
        EC: 0,
        data: news,
      });
    } catch (error) {
      console.error("Lỗi khi lấy Tin tức:", error);
      return res.status(500).json({
        message: "Lỗi khi lấy Tin tức.",
        EC: -2,
        data: null,
        error: error.message,
      });
    }
  },
  postNews: async (req, res) => {
    const { newsName, newsContent } = req.body;
    const newsImage = req.file ? req.file.filename : null;
    try {
      const news = await db.News.create({
        title: newsName,
        content: newsContent,
        image: "news/" + newsImage,
      });
      res.json(news);
    } catch {
      console.error("Lỗi khi lấy Tin tức:", error);
      res.status(500).json({ message: "Lỗi khi lấy Tin tức", error });
    }
  },
  deleteNews: async (req, res) => {
    const { id } = req.params;

    try {
      const news = await db.News.findOne({
        where: { id: id },
      });

      if (!news) {
        return res.status(404).json({
          message: "Tin tức không tồn tại.",
          EC: 1,
          data: "",
          statusCode: 404,
        });
      }
      const newsImage = news.image;
      if (newsImage) {
        try {
          deleteImage(__dirname, "../uploads/", newsImage);
          console.log("Tệp hình ảnh đã được xóa.");
        } catch (error) {
          console.error(
            "Lỗi khi xóa tệp hình ảnh hoặc tệp không tồn tại:",
            error.message
          );
          return res.status(500).json({
            message: "Lỗi khi xóa tệp hình ảnh hoặc tệp không tồn tại!",
            data: "",
            EC: -1,
            statusCode: 500,
          });
        }
      }
      await news.destroy();
      return res.status(200).json({
        message: "Xóa tin tức thành công.",
        EC: 0,
        data: null,
        statusCode: 200,
      });
    } catch (error) {
      console.error("Lỗi khi xóa tin tức:", error.message);
      return res.status(500).json({
        message: "Lỗi server khi xóa tin tức.",
        EC: -1,
        data: "",
        statusCode: 500,
      });
    }
  },

  putNews: async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const newImage = req.file ? "news/" + req.file.filename : null;

    try {
      if (!id || isNaN(id)) {
        return res.status(400).json({
          message: "ID bản tin không hợp lệ.",
          EC: -1,
          data: null,
        });
      }
      const news = await db.News.findOne({ where: { id: parseInt(id) } });

      if (!news) {
        return res.status(404).json({
          message: "Tin tức không tồn tại.",
          EC: 1,
          data: null,
        });
      }
      if (newImage && news.image) {
        try {
          deleteImage(__dirname, "../uploads/", news.image);
        } catch (error) {
          console.error("Lỗi khi xóa tệp hình ảnh cũ:", error.message);
          return res.status(500).json({
            message: "Lỗi khi xóa tệp hình ảnh cũ.",
            EC: -1,
            data: null,
          });
        }
      }

      const updatedNews = await news.update({
        title: title || news.title,
        content: content || news.content,
        image: newImage || news.image,
      });
      return res.status(200).json({
        message: "Cập nhật tin tức thành công.",
        EC: 0,
        data: updatedNews,
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật tin tức:", error.message);
      return res.status(500).json({
        message: "Lỗi server khi cập nhật tin tức.",
        EC: -2,
        data: null,
      });
    }
  },
};

module.exports = NewsController;
