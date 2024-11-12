import * as CategoryService from '../services/category'
import path from 'path'
import fs from 'fs'
import { deleteImage } from '../config/configMulter';

const CategoryController = {
    getAllCategory: async (req, res) => {
        try {
            const data = await CategoryService.getAllCategory();
            return res.status(200).json({
                EC: data.EC,
                message: data.message,
                data: data.data
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Lỗi ở Server!", //error massage
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
            return res.status(200).json({
                EC: data.EC,
                message: data.message,
                data: data.data
            })
        } catch (error) {
            console.log(error);

            const categoryImage = req.file ? req.file.filename : null; // Lấy tên file từ req.file nếu có
            deleteImage(__dirname, '../uploads/category/', categoryImage)

            return res.status(500).json({
                message: "Lỗi ở Server!", //error massage
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
            return res.status(200).json({
                message: data.message,
                EC: data.EC,
                data: data.data
            })
        } catch (error) {
            console.log(error);

            const categoryImage = req.file ? req.file.filename : null; // Lấy tên file từ req.file nếu có
            deleteImage(__dirname, '../uploads/category/', categoryImage)
            
            return res.status(500).json({
                message: "Lỗi ở Server!", //error massage
                EC: -1
            })
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const categoryId = req.params.id
            const data = await CategoryService.deleteCategory(categoryId)

            return res.status(200).json({
                message: data.message,
                EC: data.EC,
                data: data.data
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Lỗi ở Server!", //error massage
                EC: -1
            })
        }
    }
}

module.exports = CategoryController;