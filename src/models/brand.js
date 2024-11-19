'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class brand extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            brand.hasMany(models.product, {
                foreignKey: 'brand_id',
                as: 'productData'
            })
        }
    }
    brand.init({
        name: DataTypes.STRING,
        logo: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'brand',
        tableName: 'brand',
        timestamps: true,
        underscored: true,
        paranoid: true
    });
    return brand;
};