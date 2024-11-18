'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            product.hasMany(models.order_detail, {
                foreignKey: 'product_id',
                as: 'order_detailData'
            })
            product.hasMany(models.cart_item, {
                foreignKey: 'product_id',
                as: 'cart_itemData'
            })
            product.belongsTo(models.brand, {
                foreignKey: 'brand_id',
                as: 'brandData'
            })
            product.hasMany(models.review, {
                foreignKey: 'product_id',
                as: 'reviewData'
            })
            product.belongsTo(models.category, {
                foreignKey: 'category_id',
                as: 'categoryData'
            })
        }
    }
    product.init({
        name: DataTypes.STRING,
        category_id: DataTypes.INTEGER,
        brand_id: DataTypes.INTEGER,
        image: {
            type: DataTypes.TEXT,
            allowNull: false,
            get() {
                const rawValue = this.getDataValue('image');
                return rawValue ? JSON.parse(rawValue) : [];
            },
            set(value) {
                this.setDataValue('image', JSON.stringify(value));
            },
        },
        price: DataTypes.INTEGER,
        promotion_price: DataTypes.INTEGER,
        description: DataTypes.TEXT,
        quantity: DataTypes.INTEGER,
        view: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'product',
        tableName: 'product',
        timestamps: true,
        underscored: true,
        paranoid: true
    });
    return product;
};