import { deleteImage } from '../config/configMulter'
import * as ProductService from '../services/product'

const ProductController = {
    getAllProduct: async (req, res) => {
        res.status(200).json({ message: "Lấy tất cả sản phẩm thành công" })
    },

    getOneProduct: async (req, res) => {
        res.status(200).json({ message: "Lấy sản phẩm thành công" })
    },

    postProduct: async (req, res) => {
        try {
            const imageProduct = req.files ? req.files.map(file => file.filename) : [];

            const data = await ProductService.postProduct({ ...req.body, imageProduct })

            const statusCode = data.statusCode
            return res.status(statusCode).json({
                message: data.message,
                EC: data.EC,
                data: data.data
            })
        } catch (error) {
            console.log('CÓ LỖI TRONG SERVER >>>', error);

            const imageProduct = req.files ? req.files.map(file => file.filename) : null;
            deleteImage(__dirname, '../uploads/product/', imageProduct)

            return res.status(500).json({
                message: "Lỗi ở Server!",
                EC: -1
            })
        }
    },

    putProduct: async (req, res) => {
        res.status(200).json({ message: "Sửa sản phẩm thành công" })
    },

    deleteProduct: async (req, res) => {
        res.status(200).json({ message: "Xóa sản phẩm thành công" })
    },
}

module.exports = ProductController