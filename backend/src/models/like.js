
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./user');
const Post = require('./post');


class PostLike extends Model {}

PostLike.init({
    like_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    post_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Post,
            key: 'post_id'
        }
    },
    user: {
        type: DataTypes.STRING,
        references: {
            model: User,
            key: 'username'
        }
    }
}, {
    sequelize,
    tableName: 'post_likes'
});

module.exports = PostLike;