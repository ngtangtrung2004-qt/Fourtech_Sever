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

            console.log('user_id', user_id);
            console.log('product_id', product_id);

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
    },

    deleteCartItem: async (req, res) => {
        try {
            const { cartId, productId } = req.params

            const data = await CartService.deleteCartItem({ cartId, productId })

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