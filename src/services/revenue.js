const { Op, fn, col } = require("sequelize");
const db = require("../models");

const getDashboardData = async () => {
    try {
        const totalRevenueResult = await db.order.findOne({
            attributes: [[fn('SUM', col('total_price')), 'totalRevenue']],
            where: { status: '2' },
        });
        const totalRevenue = parseFloat(totalRevenueResult?.get('totalRevenue')) || 0;

        const monthlyRevenueResults = await db.order.findAll({
            attributes: [
                [fn('DATE_FORMAT', col('created_at'), '%Y-%m'), 'month'],
                [fn('SUM', col('total_price')), 'totalSales'],
            ],
            where: { status: '2' },
            group: [fn('DATE_FORMAT', col('created_at'), '%Y-%m')],
            order: [[fn('DATE_FORMAT', col('created_at'), '%Y-%m'), 'ASC']],
        });

        const monthlyRevenue = monthlyRevenueResults.map(result => ({
            month: result.get('month'),
            totalSales: parseFloat(result.get('totalSales')),
        }));

        const bestSellingProducts = await db.order_detail.findAll({
            attributes: [
                'product_id',
                [fn('SUM', col('order_detail.quantity')), 'totalSold'],
            ],
            include: {
                model: db.product,
                as: "productData",
                attributes: ['id', 'name'],
            },
            group: ['product_id'],
            order: [[fn('SUM', col('order_detail.quantity')), 'DESC']],
            limit: 1,
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