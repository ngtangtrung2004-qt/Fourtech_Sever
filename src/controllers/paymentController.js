const { default: axios, request, head } = require('axios');
require('dotenv').config()
const crypto = require('crypto');
const db = require('../models');
const { where } = require('sequelize');
var accessKey = process.env.ACCESS_KEY; //mã được cung cấp để Test accessKey
var secretKey = process.env.SECRET_KEY; //mã được cung cấp để Test secretKey

const PaymentMethodController = {
    postCreatePaymentMomo: async (req, res) => {
        try {
            const { amount, idUser, address, cartId, orderIdCode, orderInfo, productsItem } = req.body;
            console.log(req.body);
            var partnerCode = 'MOMO';
            var redirectUrl = `${process.env.URL_CLIENT}/thankyou`; //Link khi mà thanh toán xong sẽ nhảy vào

            //Việc sử dụng localhost trong ipnUrl không phù hợp nếu bạn muốn MoMo gửi thông báo thanh toán,
            //         //vì MoMo không thể truy cập vào localhost của máy tính hoặc server cục bộ của bạn. 
            //         //localhost chỉ hoạt động trên máy bạn đang chạy và không khả dụng từ Internet.
            //         //MoMo cần một URL công khai trên Internet để gửi thông báo

            //         //Dùng URL công khai Nếu bạn đã triển khai server lên một host hoặc dịch vụ cloud (như Heroku, Vercel, AWS, v.v.), hãy dùng URL của server đó, ví dụ:
            //         //var ipnUrl = 'https://your-server-domain.com/callback_payment';

            //         //Dùng ngrok để thử nghiệm trên môi trường cục bộ Nếu bạn đang phát triển trên máy cá nhân 
            //         //và muốn kiểm tra callback từ MoMo, bạn có thể dùng ngrok để tạo một URL công khai tạm 
            //         //thời trỏ đến localhost.

            //         //B1: -Máy window thì vào trang web này cài: https://dashboard.ngrok.com/get-started/setup/windows
            //         //-Máy Mac thì vào link: https://dashboard.ngrok.com/get-started/setup/macos
            //         //B2: Đăng ký tài khoản xong chạy lệnh theo hướng dẫn
            //         //(Video hướng dẫn 'https://www.youtube.com/watch?v=Cxi3cHpV238')
            var ipnUrl = `https://35b0-1-55-9-141.ngrok-free.app/api/callback_payment`;

            var requestType = "captureWallet"; //dùng phương thức quét mã
            var extraData = '';
            var orderGroupId = '';
            var autoCapture = true;
            var lang = 'vi';
            var requestId = orderIdCode;

            // Tạo chuỗi cần ký HMAC SHA256
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

            // Tạo chữ ký HMAC SHA256
            var signature = crypto
                .createHmac('sha256', secretKey)  // Bắt đầu tạo HMAC với thuật toán SHA-256
                .update(rawSignature)  // Cập nhật chuỗi dữ liệu cần mã hóa (rawSignature)
                .digest('hex'); // Chuyển chữ ký thành chuỗi định dạng hexadecimal (hex)

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

            // Kiểm tra phản hồi và trả kết quả về giao diện người dùng
            if (response.data && response.data.payUrl) {
                const order = await db.order.create({
                    user_id: idUser,  // Truyền vào từ request hoặc tìm từ DB
                    cart_id: cartId,  // Truyền vào từ request
                    address: address,  // Địa chỉ lấy từ request
                    status: 0,
                    payment_status: 0, //Chưa thanh toán
                    total_price: amount,// Tổng giá trị thanh toán từ MoMo
                    order_id_code: orderIdCode,// Mã đơn hàng
                    note: req.body.note,// Ghi chú đơn hàng
                    payment_methor: orderInfo,// Phương thức thanh toán là MoMo
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
                    payUrl: response.data.payUrl // Link thanh toán MoMo
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
            // Gửi yêu cầu kiểm tra trạng thái giao dịch
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
                // Tìm lại đơn hàng từ cơ sở dữ liệu bằng orderId
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
                    // Cập nhật trạng thái thanh toán thành công
                    await db.order.update(
                        { payment_status: 1 },
                        { where: { order_id_code: orderId } }
                    );

                    //Lấy danh sách các sản phẩm đã mua trong đơn hàng.
                    const orderDetails = await db.order_detail.findAll({
                        where: { order_id: order.id },
                    });

                    //Giảm quantity trong bảng product với số lượng tương ứng đã mua
                    for (const item of orderDetails) {
                        const product = await db.product.findOne({
                            where: { id: item.product_id },
                        });

                        if (product.quantity < item.quantity) {
                            throw new Error(`Không đủ số lượng sản phẩm ID: ${item.product_id}`);
                        }

                        //increment là một phương thức được sử dụng để tăng (hoặc giảm) giá trị của một hoặc nhiều cột trong cơ sở dữ liệu một cách trực tiếp
                        await db.product.increment(
                            { quantity: -item.quantity },
                            { where: { id: item.product_id } }
                        );
                    }


                    //Xóa sản phẩm trong giỏ hàng khi thanh toán xong
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

            // Kiểm tra sự tồn tại của người dùng
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

            // Tạo đơn hàng mới
            const order = await db.order.create({
                user_id: idUser,
                cart_id: cartId,
                address: address,
                status: 0,
                payment_status: 0, //Chưa thanh toán
                total_price: amount,
                order_id_code: orderIdCode,
                note: req.body.note,
                payment_methor: orderInfo,
            })

            // Tạo chi tiết đơn hàng và kiểm tra sản phẩm
            for (const item of productsItem) {
                await db.order_detail.create({
                    order_id: order.id,
                    product_id: item.product_id,
                    price: item.price,
                    quantity: item.quantity
                })
            }

            //Lấy danh sách các sản phẩm đã mua trong đơn hàng.
            const orderDetails = await db.order_detail.findAll({
                where: { order_id: order.id },
            });

            //Giảm quantity trong bảng product với số lượng tương ứng đã mua
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

                //increment là một phương thức được sử dụng để tăng (hoặc giảm) giá trị của một hoặc nhiều cột trong cơ sở dữ liệu một cách trực tiếp
                await db.product.increment(
                    { quantity: -item.quantity },
                    { where: { id: item.product_id } }
                );
            }


            //Xóa sản phẩm trong giỏ hàng khi thanh toán xong
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