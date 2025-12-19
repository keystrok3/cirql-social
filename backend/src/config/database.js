const { Sequelize } = require("sequelize");

// 1. Prioritize the DATABASE_URL from Docker
const sequelize = process.env.DATABASE_URL
    ? new Sequelize(process.env.DATABASE_URL, { logging: false })
    : new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            dialect: 'postgres',
            logging: false
        }
    );

async function init() {
    try {
        await sequelize.authenticate();

        console.log(`Connected to database: ${process.env.DB_NAME || 'via URL'}`);
        
    } catch (error) {
        console.error(`Database connection failed: ${error.message}`);
        process.exit(1); 
    }
};

module.exports = { sequelize, init }