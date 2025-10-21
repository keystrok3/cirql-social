const User = require('./user.js');
const { sequelize } = require('../config/database');

const { Model, DataTypes } = require('sequelize')

class Follows extends Model {}

Follows.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user: {
        type: DataTypes.STRING,
        references: {
            model: User,
            key: 'username'
        }
    },
    follows: {
        type: DataTypes.STRING,
        references: {
            model: User,
            key: 'username'
        }
    }
}, {
    sequelize,
    modelName: 'Follows',
    tableName: 'user_follows'
});

module.exports = Follows;
