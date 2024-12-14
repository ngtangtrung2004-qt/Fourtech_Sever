import * as CategoryService from '../services/category'
import { deleteImage } from '../middleware/multer';

const CategoryController = {
    getAllCategory: async (req, res) => {
        try {
            const data = await CategoryService.getAllCategory();

            const statusCode = data.statusCode
            return res.status(statusCode).json({
                EC: data.EC,
                message: data.message,
                data: data.data
            })
        } catch (error) {
            console.log('CÓ LỖI TRONG SERVER >>>', error);
            return res.status(500).json({
                message: "Lỗi ở Server!",
                EC: -1
            })
        }
    },

    getOneCategory: async (req, res) => {
        res.status(200).json({ message: "Lấy danh mục thành công" })
    },

    postCategory: async (req, res) => {
        try {
            const { categoryName } = req.body;
            const categoryImage = req.file ? req.file.filename : null; // Lấy tên file từ req.file nếu có

            const data = await CategoryService.postCategory({ categoryName, categoryImage })

            const statusCode = data.statusCode
            return res.status(statusCode).json({
                EC: data.EC,
                message: data.message,
                data: data.data
            })
        } catch (error) {
            console.log('CÓ LỖI TRONG SERVER >>>', error);

            const categoryImage = req.file ? req.file.filename : null; // Lấy tên file từ req.file nếu có
            deleteImage(__dirname, '../uploads/category/', categoryImage)

            return res.status(500).json({
                message: "Lỗi ở Server!",
                EC: -1
            })
        }
    },

    putCategory: async (req, res) => {
        try {
            const id = req.params.id
            const { categoryName } = req.body;
            console.log(categoryName);
            const categoryImage = req.file ? req.file.filename : null;

            const data = await CategoryService.putCategory({ id, categoryName, categoryImage })

            const statusCode = data.statusCode
            return res.status(statusCode).json({
                message: data.message,
                EC: data.EC,
                data: data.data
            })
        } catch (error) {
            console.log('CÓ LỖI TRONG SERVER >>>', error);

            const categoryImage = req.file ? req.file.filename : null; // Lấy tên file từ req.file nếu có
            deleteImage(__dirname, '../uploads/category/', categoryImage)

            return res.status(500).json({
                message: "Lỗi ở Server!",
                EC: -1
            })
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const categoryId = req.params.id
            const data = await CategoryService.deleteCategory(categoryId)

            const statusCode = data.statusCode
            return res.status(statusCode).json({
                message: data.message,
                EC: data.EC,
                data: data.data
            })
        } catch (error) {
            console.log('CÓ LỖI TRONG SERVER >>>', error);
            return res.status(500).json({
                message: "Lỗi ở Server!",
                EC: -1
            })
        }
    },

}

module.exports = CategoryController;