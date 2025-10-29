
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Post = require('./post');



class PostImage extends Model {}

PostImage.init({
    post_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Post,
            key: 'post_id'
        },
        allowNull: false
    },
    post_image_url: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'post_images'
});

module.exports = PostImage;