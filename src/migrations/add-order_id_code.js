'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('order', 'order_id_code', {
            type: Sequelize.STRING,
            allowNull: false,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('order', 'order_id_code');
    }
};
