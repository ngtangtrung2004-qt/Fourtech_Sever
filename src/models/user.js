'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      user.hasMany(models.order, {
        foreignKey: 'user_id', // tên của khóa ngoại trong bảng order
        as: 'orderData' // alias để lấy danh sách đơn hàng của một user
      })
      user.hasOne(models.cart, {
        foreignKey: 'user_id',
        as: 'cartData'
      })
      user.hasMany(models.review, {
        foreignKey: 'user_id',
        as: 'reviewData'
      })
    }
  }
  user.init({
    full_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    avatar: DataTypes.STRING,
    gender: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
    tableName: 'user',
    timestamps: true,
    underscored: true
  });
  return user;
};