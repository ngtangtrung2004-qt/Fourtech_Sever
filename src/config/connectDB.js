const { Sequelize } = require('sequelize');
require('dotenv').config

const database = process.env.DATABASE;

const sequelize = new Sequelize(database, 'root', null, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

const connectDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Kết nối Database thành công.');
    } catch (error) {
        console.error('Kết nối Database thất bại:', error);
    }
}

module.exports = connectDatabase