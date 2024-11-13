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
            brand.belongsTo(models.category, {
                foreignKey: 'category_id',  // Khóa ngoại trong bảng Brand
                as: 'category'              // Tên alias khi truy vấn
            });
        }
    }
    brand.init({
        name: DataTypes.STRING,
        logo: DataTypes.STRING,
        category_id: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'brand',
        tableName: 'brand',
        timestamps: true,
        underscored: true
    });
    return brand;
};