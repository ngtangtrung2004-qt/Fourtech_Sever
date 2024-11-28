const { where } = require("sequelize");
const db = require("../models");

const getAllOrder = async () => {
    try {
        const dataOrder = await db.order.findAll({
            attributes: ['id', 'user_id', 'total_price', 'status', 'payment_status', 'order_id_code', 'created_at'],
            order: [
                ['created_at', 'DESC']  // Sắp xếp theo trường 'created_at' giảm dần (DESC)
            ],
            include: [
                {
                    model: db.user,
                    as: "userData",
                    attributes: ['id', 'full_name']
                }
            ]
        })

        if (dataOrder.length > 0) {
            const formattedData = dataOrder.map((item) => {
                return {
                    id: item?.id,
                    user_id: item?.user_id,
                    total_price: item?.total_price,
                    status: item?.status,
                    payment_status: item?.payment_status,
                    order_id_code: item?.order_id_code,
                    created_at: item?.dataValues?.created_at,
                    full_name: item?.userData ? item?.userData?.full_name : null
                }
            })
            return {
                message: "Lấy tất cả đơn hàng thành công.",
                EC: 0,
                data: formattedData,
                statusCode: 200
            };
        }

    } catch (error) {
        console.log('CÓ LỖI TRONG SERVICE >>>', error);
        return {
            message: "Có lỗi trong Service!",
            EC: -1,
            data: '',
            statusCode: 500
        };
    }
}

const getOneOrder = async (orderIdCode) => {
    try {
        const dataOrder = await db.order.findOne({
            where: { order_id_code: orderIdCode },
            include: [
                {
                    model: db.user,
                    as: "userData",
                    attributes: ['id', 'full_name', 'phone', 'email']
                },
                {
                    model: db.order_detail,
                    as: "order_detailData",
                    attributes: ['id', 'product_id', 'order_id', 'price', 'quantity'],
                    include: [
                        {
                            model: db.product,
                            as: "productData",
                            attributes: ['id', 'name']
                        }
                    ]
                }
            ]
        })
        if (!dataOrder) {
            return {
                message: "Đơn hàng không tồn tại.",
                EC: 1,
                data: '',
                statusCode: 404
            };
        } else {
            const formattedData = {
                id: dataOrder?.id,
                order_id_code: dataOrder?.order_id_code,
                full_name: dataOrder?.userData?.full_name,
                phone: dataOrder?.userData?.phone,
                email: dataOrder?.userData?.email,
                address: dataOrder?.address,
                cart_id: dataOrder?.cart_id,
                total_price: dataOrder?.total_price,
                created_at: dataOrder?.dataValues.createdAt,
                status: dataOrder?.status,
                note: dataOrder?.note,
                payment_methor: dataOrder?.payment_methor,
                payment_status: dataOrder?.payment_status,
                productItem: dataOrder?.order_detailData?.map((detail) => (
                    {
                        price_product: detail?.price,
                        quantity_product: detail?.quantity,
                        name_product: detail?.productData?.name
                    }
                ))
            }
            return {
                message: "Lấy đơn hàng chi tiết thành công.",
                EC: 0,
                data: formattedData,
                statusCode: 200
            };
        }
    } catch (error) {
        console.log('CÓ LỖI TRONG SERVICE >>>', error);
        return {
            message: "Có lỗi trong Service!",
            EC: -1,
            data: '',
            statusCode: 500
        };
    }
}

const putOrder = async (dataOrder) => {
    try {
        const { orderIdCode, newStatus, newPaymentStatus } = dataOrder
        const order = await db.order.findOne({
            where: { order_id_code: orderIdCode }
        })

        if (order) {
            await db.order.update(
                {
                    status: newStatus, // Dữ liệu cần cập nhật
                    payment_status: newPaymentStatus
                },
                {
                    where: { order_id_code: orderIdCode } // Điều kiện để tìm bản ghi
                }
            );

            return {
                message: "Cập nhật đơn hàng thành công.",
                EC: 0,
                data: order,
                statusCode: 200
            }
        } else {
            return {
                message: "Đơn hàng không tồn tại.",
                EC: 1,
                data: '',
                statusCode: 404
            };
        }
    } catch (error) {
        console.log('CÓ LỖI TRONG SERVICE >>>', error);
        return {
            message: "Có lỗi trong Service!",
            EC: -1,
            data: '',
            statusCode: 500
        };
    }
}

module.exports = {
    getAllOrder,
    getOneOrder,
    putOrder
}