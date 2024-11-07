'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class cart extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            cart.hasOne(models.order, {
                foreignKey: 'cart_id', // Đặt cart_id làm khóa ngoại trong bảng Order
                as: 'orderData'
            })
            cart.belongsTo(models.user, {
                foreignKey: 'user_id',
                as: 'userData'
            })
            cart.hasMany(models.cart_item, {
                foreignKey: 'cart_id',
                as: 'cart_itemData'
            })
        }
    }
    cart.init({
        user_id: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'cart',
        tableName: 'cart',
        timestamps: false,
    });
    return cart;
};