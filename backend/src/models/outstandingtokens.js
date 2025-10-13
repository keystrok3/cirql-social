const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const User = require("./user");



class OutstandingTokens extends Model {}


OutstandingTokens.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    username: {
        type: DataTypes.STRING,
        references: {
            model: User,
            key: 'username'
        }
    },

    token: {
        type: DataTypes.STRING,
        unique: true
    }
}, {
    sequelize,
    tableName: 'outstandingtokens'
});

module.exports = OutstandingTokens;