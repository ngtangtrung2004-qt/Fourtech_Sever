'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class review extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            review.belongsTo(models.product, {
                foreignKey: 'product_id',
                as: 'productData'
            })
            review.belongsTo(models.user, {
                foreignKey: 'user_id',
                as: 'userData'
            })
        }
    }
    review.init({
        product_id: DataTypes.INTEGER,
        user_id: DataTypes.INTEGER,
        rating: DataTypes.INTEGER,
        content: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'review',
        tableName: 'review',
        timestamps: true,
        underscored: true,
        paranoid: true
    });
    return review;
};