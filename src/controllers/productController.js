import { deleteImage } from '../middleware/multer'
import * as ProductService from '../services/product'

const ProductController = {
    getAllProduct: async (req, res) => {
        try {

            const data = await ProductService.getAllProduct()
            const statusCode = data.statusCode;
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

    getOneProduct: async (req, res) => {
        try {
            const idProduct = req.params.id

            const data = await ProductService.getOneProduct(idProduct)

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
        try {
            const idProduct = req.params.id;
            const imageProduct = req.files ? req.files.map(file => file.filename) : [];

            const data = await ProductService.putProduct({ ...req.body, idProduct, imageProduct })

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

    deleteProduct: async (req, res) => {
        try {
            const productId = req.params.id
            const data = await ProductService.deleteProduct(productId)

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

    postView: async (req, res) => {
        try {
            const productId = req.params.id;
            const data = await ProductService.postView(productId)

            const statusCode = data.statusCode
            return res.status(statusCode).json({
                message: data.message,
                views: data.views
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
}

module.exports = ProductController