import * as CartService from '../services/cart'

const CartController = {
    getCart: async (req, res) => {
        try {
            const user_id = req.params.user_id

            const data = await CartService.getCart({ user_id })

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

    postCart: async (req, res) => {
        try {
            const { user_id, product_id, quantity } = req.body

            const data = await CartService.postCart({ user_id, product_id, quantity })

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
    }
}


module.exports = CartController