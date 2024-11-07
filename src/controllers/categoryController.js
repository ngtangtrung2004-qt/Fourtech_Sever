import { Sequelize } from "sequelize"
import db from '../models'

const CategoryController = {
    getAllCategory: async (req, res) => {
        res.status(200).json({ message: "Lấy tất cả danh mục thành công" })
    },

    getOneCategory: async (req, res) => {
        res.status(200).json({ message: "Lấy danh mục thành công" })
    },

    postCategory: async (req, res) => {
        try {
            const category = db.category.create(req.body)
            res.status(201).json({
                message: "Thêm danh mục thành công",
                data: req.body
            })
        } catch (error) {
            res.status(500).json({
                message: "Lỗi khi thêm danh mục !!",
                error: error.message
            })
        }

    },

    putCategory: async (req, res) => {
        res.status(200).json({ message: "Sửa danh mục thành công" })
    },

    deleteCategory: async (req, res) => {
        res.status(200).json({ message: "Xóa danh mục thành công" })
    }
}

module.exports = CategoryController;