
const { Sequelize, Model, DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const bcrypt = require('bcrypt');


class User extends Model {}


User.init({
    username: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    screen_name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING
    },
    profile_photo: {
        type: DataTypes.STRING
    },
    banner_image: {
        type: DataTypes.STRING
    },
    bio: {
        type: DataTypes.TEXT
    }
}, 
{
    sequelize,
    modelName: 'User',
    tableName: 'accounts',

    hooks: {
        beforeCreate: async (user) => {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        },

        beforeUpdate: async (user) => {
            if(user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

module.exports = User;