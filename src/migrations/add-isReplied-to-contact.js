'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
    // Thêm cột isReplied vào bảng Contacts
    await queryInterface.addColumn('contacts', 'isReplied', {
      type: Sequelize.BOOLEAN, // Kiểu dữ liệu BOOLEAN
      defaultValue: false, // Giá trị mặc định là false
      allowNull: false, // Không cho phép null
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
