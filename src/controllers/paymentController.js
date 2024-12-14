const { default: axios, request, head } = require('axios');
require('dotenv').config()
const crypto = require('crypto');
const db = require('../models');
const { where } = require('sequelize');
var accessKey = process.env.ACCESS_KEY;
var secretKey = process.env.SECRET_KEY;

const PaymentMethodController = {
    postCreatePaymentMomo: async (req, res) => {
        try {
            const { amount, idUser, address, cartId, orderIdCode, orderInfo, productsItem } = req.body;
            var partnerCode = 'MOMO';
            var redirectUrl = `${process.env.URL_CLIENT}/thankyou`;

            var ipnUrl = `${process.env.ipnUrl}/api/callback_payment`;

            var requestType = "captureWallet";
            var extraData = '';
            var orderGroupId = '';
            var autoCapture = true;
            var lang = 'vi';
            var requestId = orderIdCode;
            var rawSignature =
                'accessKey=' +
                accessKey +
                '&amount=' +
                amount +
                '&extraData=' +
                extraData +
                '&ipnUrl=' +
                ipnUrl +
                '&orderId=' +
                orderIdCode +
                '&orderInfo=' +
                orderInfo +
                '&partnerCode=' +
                partnerCode +
                '&redirectUrl=' +
                redirectUrl +
                '&requestId=' +
                requestId +
                '&requestType=' +
                requestType;

            var signature = crypto
                .createHmac('sha256', secretKey)
                .update(rawSignature)
                .digest('hex');

            //Tạo payload gửi đến MoMo
            const requestBody = JSON.stringify({
                partnerCode: partnerCode,
                partnerName: 'Test',
                storeId: 'MomoTestStore',
                requestId: requestId,
                amount: amount,
                orderId: orderIdCode,
                orderInfo: orderInfo,
                redirectUrl: redirectUrl,
                ipnUrl: ipnUrl,
                lang: lang,
                requestType: requestType,
                autoCapture: autoCapture,
                extraData: extraData,
                orderGroupId: orderGroupId,
                signature: signature,
                productsItem: productsItem
            });
            // Gửi yêu cầu đến MoMo
            const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(requestBody),
                },
            })

            if (response.data && response.data.payUrl) {
                const order = await db.order.create({
                    user_id: idUser,
                    cart_id: cartId,
                    address: address,
                    status: 0,
                    payment_status: 0,
                    total_price: amount,
                    order_id_code: orderIdCode,
                    note: req.body.note,
                    payment_methor: orderInfo,
                });

                for (const item of productsItem) {
                    await db.order_detail.create({
                        order_id: order.id,
                        product_id: item.product_id,
                        price: item.price,
                        quantity: item.quantity
                    })
                }

                return res.json({
                    success: true,
                    orderId: response.data.orderId,
                    amount: response.data.amount,
                    message: 'Tạo yêu cầu thanh toán thành công',
                    payUrl: response.data.payUrl
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Không thể tạo yêu cầu thanh toán',
                    data: response.data
                });
            }
        } catch (error) {
            console.error('Lỗi khi tạo thanh toán:', error);
            res.status(500).json({
                success: false,
                message: 'Có lỗi xảy ra khi gọi API MoMo',
                error: error.message
            });
        }
    },

    postCallbackPaymentMomo: async (req, res) => {
        try {
            const { orderId, partnerCode } = req.body;

            const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${orderId}`

            const signature = crypto
                .createHmac('sha256', secretKey)
                .update(rawSignature)
                .digest('hex');

            const requestBody = JSON.stringify({
                partnerCode: partnerCode,
                requestId: orderId,
                orderId: orderId,
                signature: signature,
                lang: 'vi',
            });

            const response = await axios.post(
                'https://test-payment.momo.vn/v2/gateway/api/query',
                requestBody,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const paymentResponse = response.data;

            if (paymentResponse.resultCode === 0) {

                const order = await db.order.findOne({
                    where: { order_id_code: orderId }
                })

                if (!order) {
                    return res.status(404).json({
                        EC: 1,
                        success: false,
                        message: 'Không tìm thấy đơn hàng với orderIdCode: ' + orderId
                    });
                } else {
                    await db.order.update(
                        { payment_status: 1 },
                        { where: { order_id_code: orderId } }
                    );
                    const orderDetails = await db.order_detail.findAll({
                        where: { order_id: order.id },
                    });
                    for (const item of orderDetails) {
                        const product = await db.product.findOne({
                            where: { id: item.product_id },
                        });

                        if (product.quantity < item.quantity) {
                            throw new Error(`Không đủ số lượng sản phẩm ID: ${item.product_id}`);
                        }
                        await db.product.increment(
                            { quantity: -item.quantity },
                            { where: { id: item.product_id } }
                        );
                    }

                    const cartItem = await db.cart_item.findOne({
                        where: { cart_id: order.cart_id }
                    })

                    if (cartItem) {
                        for (const item of orderDetails) {
                            await db.cart_item.destroy({
                                where: { product_id: item.product_id },
                                force: true
                            })
                        }
                    }

                    console.log("Thanh toán thành công");
                    return res.status(200).json({
                        success: true,
                        EC: 0,
                        message: 'Thanh toán thành công.',
                        order_id: order.id,
                    });
                }
            } else {
                console.log('Thanh toán không thành công');
                return res.status(400).json({
                    success: false,
                    EC: 1,
                    message: 'Thanh toán không thành công',
                    data: req.body,
                });
            }
        } catch (error) {
            console.error('Lỗi khi kiểm tra thanh toán:', error);
            return res.status(500).json({
                success: false,
                EC: -1,
                message: 'Có lỗi xảy ra khi kiểm tra giao dịch',
                error: error.message,
            });
        }
    },

    postCreatePaymentCOD: async (req, res) => {
        try {
            const { amount, idUser, address, cartId, orderIdCode, orderInfo, productsItem } = req.body

            if (!amount || !idUser || !address || !cartId || !orderIdCode || !orderInfo || !productsItem) {
                return res.status(400).json({
                    message: "Thiếu tham số bắt buộc!",
                    EC: 1,
                    data: ''
                })
            }

            const userId = await db.user.findOne({
                where: { id: idUser }
            })

            if (!userId) {
                return res.status(404).json({
                    EC: 1,
                    message: "Người dùng không tồn tại!",
                    data: ''
                })
            }

            const order = await db.order.create({
                user_id: idUser,
                cart_id: cartId,
                address: address,
                status: 0,
                payment_status: 0,
                total_price: amount,
                order_id_code: orderIdCode,
                note: req.body.note,
                payment_methor: orderInfo,
            })

            for (const item of productsItem) {
                await db.order_detail.create({
                    order_id: order.id,
                    product_id: item.product_id,
                    price: item.price,
                    quantity: item.quantity
                })
            }

            const orderDetails = await db.order_detail.findAll({
                where: { order_id: order.id },
            });

            for (const item of productsItem) {
                const product = await db.product.findOne({
                    where: { id: item.product_id },
                });

                if (!product) {
                    return res.status(404).json({
                        message: 'Không tìm thấy sản phẩm.',
                        data: '',
                        EC: 1
                    })
                }

                if (product.quantity < item.quantity) {
                    throw new Error(`Không đủ số lượng sản phẩm ID: ${item.product_id}`);
                }

                await db.product.increment(
                    { quantity: -item.quantity },
                    { where: { id: item.product_id } }
                );
            }

            const cartItem = await db.cart_item.findOne({
                where: { cart_id: order.cart_id }
            })

            if (cartItem) {
                for (const item of productsItem) {
                    await db.cart_item.destroy({
                        where: { product_id: item.product_id },
                        force: true
                    })
                }
            }

            return res.status(200).json({
                message: 'Đặt hàng thành công.',
                data: order,
                EC: 0
            })
        } catch (error) {
            console.log('CÓ LỖI TRONG SERVICE >>>', error);
            return res.status(500).json({
                message: "Có lỗi trong Server!",
                EC: -1,
                data: '',
            });
        }
    }
}

module.exports = PaymentMethodController