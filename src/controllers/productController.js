const ProductController = {
    getAllProduct: async (req, res) => {
        res.status(200).json({ message: "Lấy tất cả sản phẩm thành công" })
    },

    getOneProduct: async (req, res) => {
        res.status(200).json({ message: "Lấy sản phẩm thành công" })
    },

    postProduct: async (req, res) => {
        res.status(200).json({ message: "Thêm sản phẩm thành công" })
    },

    putProduct: async (req, res) => {
        res.status(200).json({ message: "Sửa sản phẩm thành công" })
    },

    deleteProduct: async (req, res) => {
        res.status(200).json({ message: "Xóa sản phẩm thành công" })
    }
}

module.exports = ProductController