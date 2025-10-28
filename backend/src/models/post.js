const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const User = require("./user");


class Post extends Model {

}

Post.init({
    post_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    post_text: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    user: {
        type: DataTypes.STRING,
        references: {
            model: User,
            key: 'username'
        }
    },

}, {
    sequelize,
    modelName: 'Post',
    tableName: 'posts'
});

module.exports = Post;