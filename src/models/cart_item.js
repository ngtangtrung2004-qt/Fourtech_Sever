'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class cart_item extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            cart_item.belongsTo(models.cart, {
                foreignKey: 'cart_id',
                as: 'cartData'
            })
            cart_item.belongsTo(models.product, {
                foreignKey: 'product_id',
                as: 'productData'
            })
        }
    }
    cart_item.init({
        cart_id: DataTypes.INTEGER,
        product_id: DataTypes.INTEGER,
        quantity: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'cart_item',
        tableName: 'cart_item',
        timestamps: true,
        underscored: true,
        paranoid: true
    });
    return cart_item;
};