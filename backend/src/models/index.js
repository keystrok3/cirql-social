
const User = require("./user.js");
const BlacklistedTokens = require("./blacklistedtokens.js");
const OutstandingTokens = require("./outstandingtokens.js");


const sync_tables = async () => {

    User.hasMany(OutstandingTokens, { foreignKey: 'username', sourceKey: 'username' });
    OutstandingTokens.belongsTo(User, { foreignKey: 'username', targetKey: 'username' })

    OutstandingTokens.hasOne(BlacklistedTokens, { foreignKey: 'token_id', sourceKey: 'id'});
    BlacklistedTokens.belongsTo(OutstandingTokens, { foreignKey: 'token_id', targetKey: 'id'})

    try {
        await User.sync();
        console.log(`Table accounts created`);

        await OutstandingTokens.sync();
        console.log('Table outstandingtokens created');

        await BlacklistedTokens.sync();
        console.log('Table blacklistedtokens created');
        
    } catch (error) {
        console.error(`Error syncing tables: ${e}`);
    }
};


module.exports = { sync_tables}