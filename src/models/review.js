"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      review.belongsTo(models.product, {
        foreignKey: "product_id",
        as: "productData",
         onDelete: 'SET NULL'
      });
      review.belongsTo(models.user, {
        foreignKey: "user_id",
        as: "userData",
         onDelete: 'SET NULL'
      });
      review.hasMany(models.review, {
        foreignKey: "parent_comment_id",
        as: "replies",
         onDelete: 'CASCADE'
      });
      review.belongsTo(models.review, {
        foreignKey: "parent_comment_id",
        as: "parentComment",
         onDelete: 'SET NULL'
      });
    }
  }
  review.init(
    {
      product_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      rating: DataTypes.INTEGER,
      content: DataTypes.STRING,
      parent_comment_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "review",
      tableName: "review",
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );
  return review;
};
