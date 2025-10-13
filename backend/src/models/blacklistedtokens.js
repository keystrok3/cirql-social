const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const OutstandingTokens = require("./outstandingtokens");


class BlacklistedTokens extends Model {

}


BlacklistedTokens.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    token_id: {
        type: DataTypes.INTEGER,
        references: {
            model: OutstandingTokens,
            key: 'id'
        }
    }
}, {
    sequelize,
    tableName: 'blacklistedtokens'
});

module.exports = BlacklistedTokens;