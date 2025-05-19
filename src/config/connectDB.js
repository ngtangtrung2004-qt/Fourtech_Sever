const { Sequelize } = require('sequelize');
require('dotenv').config

let sequelize;

if (process.env.NODE_ENV === 'production') {
    // Khi chạy trên Render hoặc môi trường production
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: false
    });
} else {
    // Khi chạy ở local
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            dialect: 'mysql',
            logging: false
        }
    );
}

const connectDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Kết nối Database thành công.');
    } catch (error) {
        console.error('Kết nối Database thất bại:', error);
    }
}

module.exports = connectDatabase