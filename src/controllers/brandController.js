const BrandController = {
    getAllBrand: (req, res) => {
        res.status(200).json({message: "Lấy tất cả thương hiệu thành công"})
    },

    getOneBrand: (req, res) => {
        res.status(200).json({message: "Lấy thương hiệu thành công"})
    },

    postBrand: (req, res) => {
        res.status(200).json({message: "Thêm thương hiệu thành công"})
    },

    putBrand: (req, res) => {
        res.status(200).json({message: "Sửa thương hiệu thành công"})
    },

    deleteBrand: (req, res) => {
        res.status(200).json({message: "Xóa thương hiệu thành công"})
    },
}

module.exports = BrandController;