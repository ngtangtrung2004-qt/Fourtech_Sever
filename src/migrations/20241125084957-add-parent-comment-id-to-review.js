'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('review', 'parent_comment_id', {
      type: Sequelize.INTEGER, // Kiểu dữ liệu là INTEGER để tham chiếu đến id của comment khác
      allowNull: true, // Có thể null (không phải tất cả các comment đều có parent)
      references: {
        model: 'review', // Bảng được tham chiếu
        key: 'id', // Cột id của bảng reviews
      },
      onUpdate: 'CASCADE', // Khi parent comment id thay đổi, các comment con cũng cập nhật
      onDelete: 'SET NULL', // Khi comment cha bị xóa, đặt giá trị của comment con là null
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('review', 'parent_comment_id');
  }
};
