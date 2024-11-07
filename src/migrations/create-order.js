'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('order', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            user_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'user',
                    key: 'id'
                }
            },
            cart_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'cart',
                    key: 'id'
                }
            },
            total_price: {
                type: Sequelize.INTEGER,
            },
            discount: {
                type: Sequelize.INTEGER,
            },
            status: {
                type: Sequelize.INTEGER,
            },
            note: {
                type: Sequelize.TEXT,
            },
            payment_methor: {
                type: Sequelize.STRING,
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('order');
    }
};