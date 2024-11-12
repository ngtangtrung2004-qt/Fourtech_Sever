'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class order extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            order.belongsTo(models.user, {
                foreignKey: 'user_id', // tên của khóa ngoại trong bảng Order
                as: 'userData' // alias để lấy thông tin user của một đơn hàng
            })
            order.belongsTo(models.cart, {
                foreignKey: 'cart_id',
                as: 'cartData'
            })
            order.hasMany(models.order_detail, {
                foreignKey: 'order_id',
                as: 'order_detailData'
            })
        }
    }
    order.init({
        user_id: DataTypes.INTEGER,
        cart_id: DataTypes.INTEGER,
        total_price: DataTypes.INTEGER,
        discount: DataTypes.INTEGER,
        status: DataTypes.INTEGER,
        note: DataTypes.TEXT,
        payment_methor: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'order',
        tableName: 'order',
        timestamps: true,
        underscored: true
    });
    return order;
};