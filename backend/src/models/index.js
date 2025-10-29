
const User = require("./user.js");
const BlacklistedTokens = require("./blacklistedtokens.js");
const OutstandingTokens = require("./outstandingtokens.js");
const Follows = require("./user_follows.js");
const Post = require("./post.js");
const PostImage = require("./post_images.js");

const sync_tables = async () => {

    User.hasMany(OutstandingTokens, { foreignKey: 'username', sourceKey: 'username' });
    OutstandingTokens.belongsTo(User, { foreignKey: 'username', targetKey: 'username' })

    OutstandingTokens.hasOne(
        BlacklistedTokens, 
        { 
            foreignKey: 'token_id', 
            sourceKey: 'id', 
            onDelete: 'CASCADE'
        }
    );
    BlacklistedTokens.belongsTo(OutstandingTokens, { foreignKey: 'token_id', targetKey: 'id'})

    // a user can follow many users
    User.hasMany(Follows, { foreignKey: 'user', as: 'Following' });
    // the follows entry belongs to the user
    Follows.belongsTo(User, { foreignKey: 'user', as: 'Follower' });

    // A user can be followed by many users
    User.hasMany(
        Follows, 
        { 
            foreignKey: 'follows', 
            as: 'Followers' // Alias used when retrieving the list of users following this user 
        }
    )
    // the follows entry belongs to the user (the followee)
    Follows.belongsTo(User, {
        foreignKey: 'follows',
        as: 'Followee'
    })

    User.hasMany(Post, { foreignKey: 'user' });
    Post.belongsTo(User, { foreignKey: 'user' });

    Post.hasMany(PostImage, { onDelete: 'CASCADE' });
    PostImage.belongsTo(Post, { foreignKey: 'post_id' });

    Post.hasMany(PostImage, { foreignKey: 'post_id' });
    PostImage.belongsTo(Post, { foreignKey: 'post_id' });

    try {
        await User.sync();
        console.log(`Table accounts created`);

        await OutstandingTokens.sync();
        console.log('Table outstandingtokens created');

        await Follows.sync();
        console.log('Table user_follows created');

        await BlacklistedTokens.sync();
        console.log('Table blacklistedtokens created');

        await Post.sync();
        console.log('Table posts created')

        await PostImage.sync();
        console.log('Table post_images created')
        
    } catch (error) {
        console.error(`Error syncing tables: ${e}`);
    }
};


module.exports = { sync_tables}