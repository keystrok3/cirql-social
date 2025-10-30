
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Post = require('../models/post');
const User = require('./user');


class Repost extends Model {}


Repost.init({
    repost_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    post: {
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
    }
}, {
    sequelize,
    tableName: 'reposts'
});

module.exports = Repost;