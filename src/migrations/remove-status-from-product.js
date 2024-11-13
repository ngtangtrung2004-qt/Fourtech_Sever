'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('product', 'status'); // Xóa trường age khỏi bảng Users
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('produt', 'status', {
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    });
  }
};
