'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Thêm cột category_id vào bảng Brand
    await queryInterface.addColumn('brand', 'category_id', {
      type: Sequelize.INTEGER,
      allowNull: false, // Đảm bảo không thể null
      references: {
        model: 'category', // Bảng mà khóa ngoại trỏ tới
        key: 'id',            // Trường trong bảng Categories
      }
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('brand', 'category_id');
  }
};
