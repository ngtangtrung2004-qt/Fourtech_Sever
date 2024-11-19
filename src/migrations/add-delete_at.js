module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Lấy danh sách tất cả các bảng
        const tables = await queryInterface.showAllTables();

        // Duyệt qua từng bảng và thêm cột `deleted_at`
        for (const table of tables) {
            await queryInterface.addColumn(table, 'deleted_at', {
                type: Sequelize.DATE,
                allowNull: true,
            });
        }
    },

    down: async (queryInterface, Sequelize) => {
        // Lấy danh sách tất cả các bảng
        const tables = await queryInterface.showAllTables();

        // Duyệt qua từng bảng và xóa cột `deleted_at`
        for (const table of tables) {
            await queryInterface.removeColumn(table, 'deleted_at');
        }
    },
};
