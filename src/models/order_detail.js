'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class order_detail extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            order_detail.belongsTo(models.order, {
                foreignKey: 'order_id',
                as: 'orderData'
            })
            order_detail.belongsTo(models.product, {
                foreignKey: 'product_id',
                as: 'productData'
            })
        }
    }
    order_detail.init({
        order_id: DataTypes.INTEGER,
        product_id: DataTypes.INTEGER,
        price: DataTypes.INTEGER,
        quantity: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'order_detail',
        tableName: 'order_detail',
        timestamps: false,
    });
    return order_detail;
};