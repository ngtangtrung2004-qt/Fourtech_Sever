const { where } = require("sequelize");
const db = require("../models");

const getCart = async (dataCart) => {
    try {
        const { user_id } = dataCart
        const cart = await db.cart.findOne({
            where: { user_id: user_id },
            include: [
                {
                    model: db.cart_item,
                    as: 'cart_itemData',
                    include: {
                        model: db.product,
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

        const invalidCartItems = Array.isArray(cart.cart_itemData)
            ? cart.cart_itemData.filter(item => item.productData === null)
            : [];

        for (const item of invalidCartItems) {
            await db.cart_item.destroy({
                where: { id: item.id },
                force: true
            })
        }

        const validCartItems = Array.isArray(cart.cart_itemData)
            ? cart.cart_itemData.filter(item => item.productData !== null)
            : [];

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
        let cart = await db.cart.findOne({
            where: { user_id: user_id }
        })

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
            await db.cart_item.update(
                { quantity: quantity },
                { where: { id: cartItem.id } }
            );
            return {
                message: "Cập nhật số lượng sản phẩm thành công!",
                EC: 0,
                data: { ...cartItem, quantity },
                statusCode: 200
            };
        } else {
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
            const updatedCart = await db.cart_item.findAll({
                where: { cart_id: cartId },
                include: [{ model: db.product, as: 'productData' }],
            });

            return {
                message: 'Xóa sản phẩm trong giỏ hàng thành công.',
                EC: 0,
                data: updatedCart,
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