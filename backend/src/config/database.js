
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: false
    }
);


/**
 * Initialize Database
 * */ 
async function init() {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });

        console.log(`Connected to database ${process.env.DB_NAME}`);
        
    } catch (error) {
        console.error(`Database connection failed: ${error.message}`);
        process.emit(1);
    }
};

module.exports = { sequelize, init}