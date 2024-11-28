const { Op, fn, col } = require("sequelize");
const db = require("../models");

const getDashboardData = async () => {
    try {
        //Lấy tổng doanh thu
        const totalRevenueResult = await db.order.findOne({
            attributes: [[fn('SUM', col('total_price')), 'totalRevenue']],
            where: { status: '2' },
        });
        const totalRevenue = parseFloat(totalRevenueResult?.get('totalRevenue')) || 0;
        // Lấy doanh thu theo tháng
        const monthlyRevenueResults = await db.order.findAll({
            attributes: [
                [fn('DATE_FORMAT', col('created_at'), '%Y-%m'), 'month'], // Lấy tháng năm
                [fn('SUM', col('total_price')), 'totalSales'],          // Tổng doanh thu
            ],
            where: { status: '2' },
            group: [fn('DATE_FORMAT', col('created_at'), '%Y-%m')],
            order: [[fn('DATE_FORMAT', col('created_at'), '%Y-%m'), 'ASC']],
        });

        const monthlyRevenue = monthlyRevenueResults.map(result => ({
            month: result.get('month'),
            totalSales: parseFloat(result.get('totalSales')),
        }));
        // Lấy sản phẩm bán chạy nhất
        const bestSellingProducts = await db.order_detail.findAll({
            attributes: [
                'product_id',
                [fn('SUM', col('order_detail.quantity')), 'totalSold'], // Tổng số lượng bán ra
            ],
            include: {
                model: db.product, // Tham chiếu bảng sản phẩm
                as: "productData",
                attributes: ['id', 'name'], // Lấy tên sản phẩm
            },
            group: ['product_id'],
            order: [[fn('SUM', col('order_detail.quantity')), 'DESC']],
            limit: 1, // Chỉ lấy sản phẩm bán chạy nhất
        });

        const bestSellingProduct = bestSellingProducts[0]
            ? {
                id: bestSellingProducts[0].productData.id,
                name: bestSellingProducts[0].productData.name,
                totalSold: parseInt(bestSellingProducts[0].get('totalSold'), 10),
            }
            : null;
        return {
            statusCode: 200,
            message: 'Dữ liệu dashboard được lấy thành công.',
            EC: 0,
            data: {
                totalRevenue,
                monthlyRevenue,
                bestSellingProduct,
            },
        };
    } catch (error) {
        console.log('CÓ LỖI TRONG SERVICE >>>', error);

        return {
            message: "Có lỗi trong Service!",
            data: '',
            EC: -1,
            statusCode: 500
        }
    }
}

module.exports = {
    getDashboardData
}