import * as OrderService from '../services/order'

const OrderController = {
    getAllOrder: async (req, res) => {
        try {
            const data = await OrderService.getAllOrder()

            const statusCode = data.statusCode
            return res.status(statusCode).json({
                data: data.data,
                EC: data.EC,
                message: data.message
            })
        } catch (error) {
            console.log('CÓ LỖI TRONG SERVER >>>', error);
            return res.status(500).json({
                message: "Lỗi ở Server!",
                EC: -1
            })
        }
    },

    getOneOrder: async (req, res) => {
        try {
            const { orderIdCode } = req.params
            const data = await OrderService.getOneOrder(orderIdCode)

            const statusCode = data.statusCode
            return res.status(statusCode).json({
                data: data.data,
                EC: data.EC,
                message: data.message
            })
        } catch (error) {
            console.log('CÓ LỖI TRONG SERVER >>>', error);
            return res.status(500).json({
                message: "Lỗi ở Server!",
                EC: -1
            })
        }
    },

    putOrder: async (req, res) => {
        try {
            const { orderIdCode } = req.params
            const { newStatus, newPaymentStatus } = req.body;
            const data = await OrderService.putOrder({ orderIdCode, newStatus, newPaymentStatus })

            const statusCode = data.statusCode
            return res.status(statusCode).json({
                data: data.data,
                EC: data.EC,
                message: data.message
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

module.exports = OrderController