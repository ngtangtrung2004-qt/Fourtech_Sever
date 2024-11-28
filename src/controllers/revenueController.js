import * as RevenueService from '../services/revenue'

const RevenueController = {
    getDashboardData: async (req, res) => {
        try {
            const data = await RevenueService.getDashboardData()

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

module.exports = RevenueController