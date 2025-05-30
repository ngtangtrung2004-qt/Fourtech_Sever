'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Contact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Contact.init({
    UserContact: DataTypes.STRING,
    EmailContact: DataTypes.STRING,
    PhoneContact: DataTypes.STRING,
    messageContact: DataTypes.STRING,
    isReplied: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false, // Giá trị mặc định
  },
  }, {
    sequelize,
    modelName: 'Contact',
    paranoid: false
  });
  return Contact;
};