import { deleteImage } from '../middleware/multer';
import * as BrandService from '../services/brand'

const BrandController = {
    getAllBrand: async (req, res) => {
        try {
            const data = await BrandService.getAllBrand()

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

    getOneBrand: (req, res) => {
        res.status(200).json({ message: "Lấy thương hiệu thành công" })
    },

    postBrand: async (req, res) => {
        try {
            const { brandName } = req.body
            const brandImage = req.file ? req.file.filename : null;

            const data = await BrandService.postBrand({ ...req.body, brandImage })

            const statusCode = data.statusCode
            return res.status(statusCode).json({
                message: data.message,
                EC: data.EC,
                data: data.data
            })
        } catch (error) {
            console.log('CÓ LỖI TRONG SERVER >>>', error);

            const brandImage = req.file ? req.file.filename : null;
            deleteImage(__dirname, '../uploads/brand/', brandImage)

            return res.status(500).json({
                message: "Lỗi ở Server!",
                EC: -1
            })
        }
    },

    putBrand: async (req, res) => {
        try {
            const id = req.params.id
            const brandName = req.body.brandName;
            const brandImage = req.file ? req.file.filename : null;

            const data = await BrandService.putBrand({ id, brandName, brandImage })

            const statusCode = data.statusCode
            return res.status(statusCode).json({
                message: data.message,
                EC: data.EC,
                data: data.data
            })
        } catch (error) {
            console.log('CÓ LỖI TRONG SERVER >>>', error);

            const brandImage = req.file ? req.file.filename : null;
            deleteImage(__dirname, '../uploads/brand/', brandImage)

            return res.status(500).json({
                message: "Lỗi ở Server!",
                EC: -1
            })
        }
    },

    deleteBrand: async (req, res) => {
        try {
            const brandId = req.params.id
            const data = await BrandService.deleteBrand(brandId)

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

module.exports = BrandController;