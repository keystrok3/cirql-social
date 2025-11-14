
const BlacklistedTokens = require("./blacklistedtokens.js");
const OutstandingTokens = require("./outstandingtokens.js");
const PostImage = require("./post_images.js");
const PostLike = require("./like.js");
const Follows = require("./user_follows.js");
const Repost = require("./repost.js");
const Post = require("./post.js");
const User = require("./user.js");
const Comment = require("./comments.js");
const Notification = require("./notifications.js");

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

    // PostImages relationship
    Post.hasMany(PostImage, { foreignKey: 'post_id', onDelete: 'CASCADE' });
    PostImage.belongsTo(Post, { foreignKey: 'post_id' });

    // Likes relationships 
    Post.hasMany(PostLike, { foreignKey: 'post_id'});
    PostLike.belongsTo(Post, { foreignKey: 'post_id' });

    User.hasMany(PostLike, { foreignKey: 'user' });
    PostLike.belongsTo(User, { foreignKey: 'user' });

    // Reposts relationships
    Post.hasMany(Repost, { foreignKey: 'post_id' });
    Repost.belongsTo(Post, { foreignKey: 'post_id'});

    User.hasMany(Repost, { foreignKey: 'user' });
    Repost.belongsTo(User, { foreignKey: 'user' });

    // Comments relationships
    Post.hasMany(Comment, { foreignKey: 'post_id' });
    Comment.belongsTo(Post, { foreignKey: 'post_id' });

    User.hasMany(Comment, { foreignKey: 'user' });
    Comment.belongsTo(User, { foreignKey: 'user' });

    Notification.belongsTo(Post, {
        foreignKey: 'source_id',
        as: 'repostSource',
        constraints: false // disable fk check in db
    });

    Notification.belongsTo(Comment, {
        foreignKey: 'source_id',
        as: 'commentSource',
        constraints: false
    });

    Notification.belongsTo(PostLike, {
        foreignKey: 'source_id',
        as: 'likeSource',
        constraints: false
    });

    Notification.belongsTo(Follows, {
        foreignKey: 'source_id',
        as: 'followSource',
        constraints: false
    });

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
        console.log('Table posts created');

        await PostImage.sync();
        console.log('Table post_images created');

        await PostLike.sync();
        console.log('Table post_likes created');

        await Repost.sync();
        console.log('Table reposts created');

        await Comment.sync()
        console.log("Table comments created")

        await Notification.sync();
        console.log("Table notifications created")
        
    } catch (error) {
        console.error(`Error syncing tables: ${e}`);
    }
};


module.exports = { sync_tables}