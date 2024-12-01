const db = require("../models");
import { deleteImage } from "../middleware/multer";

const NewsController = {
  getAllNews: async (req, res) => {
    try{

      const news = await db.News.findAll();
      res.json(news);
    }catch(error){
       res.status(500).json({ message: "Không thể lấy phản hồi", error });
    }
  },
  getOneNews: async (req, res) => {
    const idNews = req.params.id;

    // Kiểm tra `idNews` là số hợp lệ
    if (!idNews || isNaN(idNews)) {
      return res.status(400).json({
        message: "ID bản tin không hợp lệ.",
        EC: -1, // Error Code -1: Dữ liệu không hợp lệ
        data: null,
      });
    }

    try {
      // Tìm bản tin theo ID
      const news = await db.News.findOne({
        where: { id: parseInt(idNews) },
        attributes: [
          "id",
          "title",
          "content",
          "image",
          "createdAt",
          "updatedAt",
        ], // Chỉ lấy các trường cần thiết
      });

      // Kiểm tra nếu không tìm thấy
      if (!news) {
        return res.status(404).json({
          message: "Bản tin không tồn tại.",
          EC: 1, // Error Code 1: Không tìm thấy
          data: null,
        });
      }

      // Trả về kết quả nếu tìm thấy
      return res.status(200).json({
        message: "Lấy chi tiết bản tin thành công.",
        EC: 0, // Error Code 0: Thành công
        data: news,
      });
    } catch (error) {
      // Log lỗi và trả về lỗi server
      console.error("Lỗi khi lấy Tin tức:", error);
      return res.status(500).json({
        message: "Lỗi khi lấy Tin tức.",
        EC: -2, // Error Code -2: Lỗi từ server
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
      console.error("Lỗi khi lấy Tin tức:", error); // Log lỗi để debug
      res.status(500).json({ message: "Lỗi khi lấy Tin tức", error });
    }
  },
  deleteNews: async (req, res) => {
    const { id } = req.params;

    try {
      // Tìm tin tức trong cơ sở dữ liệu
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

      // Lấy tên tệp hình ảnh từ bản ghi tin tức
      const newsImage = news.image;

      // Xóa tệp hình ảnh (nếu có)
      if (newsImage) {
        try {
          deleteImage(__dirname, "../uploads/", newsImage); // Hàm tự viết để xóa ảnh
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

      // Xóa tin tức khỏi cơ sở dữ liệu
      await news.destroy();

      // Trả về phản hồi thành công
      return res.status(200).json({
        message: "Xóa tin tức thành công.",
        EC: 0,
        data: null,
        statusCode: 200,
      });
    } catch (error) {
      console.error("Lỗi khi xóa tin tức:", error.message); // Log lỗi để dễ debug
      return res.status(500).json({
        message: "Lỗi server khi xóa tin tức.",
        EC: -1,
        data: "",
        statusCode: 500,
      });
    }
  },
  putNews: async (req, res) => {
    const { id } = req.params; // Lấy ID từ URL
  const { title, content } = req.body; // Lấy dữ liệu từ body
  const newImage = req.file ? "news/" + req.file.filename : null; // Nếu có file upload

  try {
    // Kiểm tra nếu ID hợp lệ
    if (!id || isNaN(id)) {
      return res.status(400).json({
        message: "ID bản tin không hợp lệ.",
        EC: -1,
        data: null,
      });
    }

    // Tìm bản tin trong cơ sở dữ liệu
    const news = await db.News.findOne({ where: { id: parseInt(id) } });

    if (!news) {
      return res.status(404).json({
        message: "Tin tức không tồn tại.",
        EC: 1,
        data: null,
      });
    }

    // Nếu có hình ảnh mới, xóa hình ảnh cũ
    if (newImage && news.image) {
      try {
        deleteImage(__dirname, "../uploads/", news.image); // Xóa tệp hình ảnh cũ
      } catch (error) {
        console.error("Lỗi khi xóa tệp hình ảnh cũ:", error.message);
        return res.status(500).json({
          message: "Lỗi khi xóa tệp hình ảnh cũ.",
          EC: -1,
          data: null,
        });
      }
    }

    // Cập nhật bản tin
    const updatedNews = await news.update({
      title: title || news.title, // Nếu không gửi title mới, giữ nguyên title cũ
      content: content || news.content,
      image: newImage || news.image,
    });

    // Trả về phản hồi thành công
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
