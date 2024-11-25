const { where } = require("sequelize");
const db = require("../models");

const getCart = async (dataCart) => {
    try {
        const { user_id } = dataCart
        const cart = await db.cart.findOne({
            where: { user_id: user_id },
            include: [
                {
                    model: db.cart_item, // Đảm bảo sử dụng đúng tên alias/model
                    as: 'cart_itemData',
                    include: {
                        model: db.product, // Tham chiếu đúng đến model sản phẩm
                        as: 'productData',
                    }
                }
            ],
        })

        if (!cart) {
            return {
                message: "Giỏ hàng trống!",
                data: '',
                EC: 0,
                statusCode: 200
            }
        }

        // Lọc các mục giỏ hàng có sản phẩm không hợp lệ
        const invalidCartItems = Array.isArray(cart.cart_itemData)
            ? cart.cart_itemData.filter(item => item.productData === null)
            : []; // Nếu không phải mảng, trả về mảng rỗng

        // Xóa các mục giỏ hàng không hợp lệ
        for (const item of invalidCartItems) {
            await db.cart_item.destroy({
                where: { id: item.id },
                force: true
            })
        }

        // Lấy lại các mục giỏ hàng hợp lệ
        const validCartItems = Array.isArray(cart.cart_itemData)
            ? cart.cart_itemData.filter(item => item.productData !== null)
            : []; // Nếu không phải mảng, trả về mảng rỗng

        return {
            message: "Lấy giỏ hàng thành công.",
            EC: 0,
            data: validCartItems,
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

const postCart = async (dataCart) => {
    try {
        const { user_id, product_id, quantity } = dataCart

        // Kiểm tra sản phẩm có tồn tại không
        const product = await db.product.findOne({
            where: { id: product_id }
        });

        if (!product) {
            return {
                message: "Sản phẩm không tồn tại",
                EC: 1,
                data: '',
                statusCode: 404
            };
        }

        //kiểm tra giỏ hàng đã tồn tại cho người dùng
        let cart = await db.cart.findOne({
            where: { user_id: user_id }
        })

        //nếu chưa có thì tạo giỏ hàng
        if (!cart) {
            cart = await db.cart.create({
                user_id: user_id,
            })
        }

        let cartItem = await db.cart_item.findOne({
            where: {
                cart_id: cart.id,
                product_id: product_id
            }
        })

        if (cartItem) {
            // Cập nhật số lượng nếu sản phẩm đã tồn tại trong giỏ hàng
            cartItem.quantity += quantity; // Cộng thêm số lượng mới
            await db.cart_item.update(
                { quantity: cartItem.quantity },
                { where: { id: cartItem.id } }
            );
            return {
                message: "Cập nhật số lượng sản phẩm thành công!",
                EC: 0,
                data: cartItem,
                statusCode: 200
            };
        } else {
            // Thêm mới sản phẩm vào giỏ hàng nếu chưa có
            const newCartItem = await db.cart_item.create({
                cart_id: cart.id,
                product_id,
                quantity,
            });

            return {
                message: "Thêm vào giỏ hàng thành công!",
                EC: 0,
                data: newCartItem,
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

const deleteCartItem = async (data) => {
    try {
        const cartId = data.cartId;
        const productId = data.productId;

        const result = await db.cart_item.destroy({
            where: {
                cart_id: cartId,
                product_id: productId,
            },
            force: true, // Xóa vĩnh viễn
        });

        if (result) {
            // Lấy lại giỏ hàng sau khi xóa
            const updatedCart = await db.cart_item.findAll({
                where: { cart_id: cartId },
                include: [{ model: db.product, as: 'productData' }],
            });

            return {
                message: 'Xóa sản phẩm trong giỏ hàng thành công.',
                EC: 0,
                data: updatedCart, // Trả về danh sách giỏ hàng còn lại
                statusCode: 200,
            };
        } else {
            return {
                message: 'Không tìm thấy sản phẩm trong giỏ hàng.',
                EC: 1,
                data: null,
                statusCode: 404,
            };
        }
    } catch (error) {
        console.log('CÓ LỖI TRONG SERVICE >>>', error);
        return {
            message: 'Có lỗi trong Service!',
            EC: -1,
            data: null,
            statusCode: 500,
        };
    }
};

module.exports = {
    getCart,
    postCart,
    deleteCartItem
}