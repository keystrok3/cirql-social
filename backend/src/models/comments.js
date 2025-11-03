
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Post = require('./post');
const User = require('./user');


class Comment extends Model {}

Comment.init({
    comment_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Post,
            key: 'post_id'
        }
    },
    user: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: User,
            key: 'username'
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'comments'
});

module.exports = Comment;