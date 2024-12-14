const { where } = require("sequelize");
const db = require("../models");

const getAllOrder = async () => {
    try {
        const dataOrder = await db.order.findAll({
            attributes: ['id', 'user_id', 'total_price', 'status', 'payment_status', 'order_id_code', 'created_at'],
            order: [
                ['created_at', 'DESC']
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
        } else {
            return {
                message: "Không có đơn hàng nào.",
                EC: 0,
                data: '',
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

const getOrderByUser = async (idUser) => {
    try {
        const dataOrder = await db.order.findAll({
            where: { user_id: idUser },
            attributes: ['id', 'order_id_code', 'status', 'created_at'],
            order: [
                ['created_at', 'DESC']
            ]
        })
        return {
            message: "Lấy tất cả đơn hàng thành công.",
            EC: 0,
            data: dataOrder,
            statusCode: 200
        };

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
                            attributes: ['id', 'name', 'image']
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
                        name_product: detail?.productData?.name,
                        image_product: detail?.productData?.image
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
                    status: newStatus,
                    payment_status: newPaymentStatus
                },
                {
                    where: { order_id_code: orderIdCode }
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

const putCancelOrder = async (dataOrder) => {
    try {
        const orderIdCode = dataOrder
        const order = await db.order.findOne({
            where: { order_id_code: orderIdCode }
        })

        if (order) {
            await db.order.update(
                {
                    status: 3,
                    payment_status: 3
                },
                {
                    where: { order_id_code: orderIdCode }
                }
            );

            const newOrder = await db.order.findOne({
                where: { order_id_code: orderIdCode }
            })

            return {
                message: "Hủy đơn hàng thành công.",
                EC: 0,
                data: newOrder,
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

const putFinishOrder = async (dataOrder) => {
    try {
        const orderIdCode = dataOrder
        const order = await db.order.findOne({
            where: { order_id_code: orderIdCode }
        })

        if (order) {
            await db.order.update(
                {
                    status: 2,
                    payment_status: 1
                },
                {
                    where: { order_id_code: orderIdCode }
                }
            );

            const newOrder = await db.order.findOne({
                where: { order_id_code: orderIdCode }
            })

            return {
                message: "Cập nhật đơn hàng thành công.",
                EC: 0,
                data: newOrder,
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
    getOrderByUser,
    getOneOrder,
    putOrder,
    putCancelOrder,
    putFinishOrder
}