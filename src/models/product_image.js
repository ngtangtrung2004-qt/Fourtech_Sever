'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class product_image extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            product_image.belongsTo(models.product, {
                foreignKey: 'product_id',
                as: 'productData'
            })
        }
    }
    product_image.init({
        product_id: DataTypes.INTEGER,
        url: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'product_image',
        tableName: 'product_image',
        timestamps: false,
    });
    return product_image;
};