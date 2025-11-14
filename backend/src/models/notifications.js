
const { Model, DataTypes } = require('sequelize');
const User = require('./user.js');
const { sequelize } = require('../config/database.js');


/**
 * Stores notifications for user events e.g., liking posts,
 * reposting, commenting, and following other users
*/
class Notification extends Model {

    getSource(options = {}) {
        switch(this.sourceType) {
            case 'Like': 
                return this.getLikeSource(options);
            case 'Comment':
                return this.getCommentSource(options);
            case 'Follow':
                return this.getFollowSOurce(options);
            case 'Repost':
                return this.getRepostSource(options);
            default:
                return Promise.resolve(null);
        }

    }
}

Notification.init({
    receiver: {     // who receieves
        type: DataTypes.STRING, 
        references: {
            model: User,
            key: 'username'
        },
        allowNull: false
    },
    actor: {   // who caused it
        type: DataTypes.STRING,
        references: {
            model: User,
            key: 'username'
        },
        allowNull: false
    },
    notification_type: { // like, repost, comment, follow
        type: DataTypes.STRING,
        allowNull: false
    },
    source_id: { // repost_id or follow_id or like_id or comment_id
        type: DataTypes.INTEGER,
        allowNull: false
    },
    sourceType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'notifications',

    hooks: {
        afterFind: (findResult) => {
            if(!Array.isArray(findResult)) findResult = [findResult]

            for(const instance of findResult) {
                if(instance.sourceType === 'Repost' && instance.repostSource) {
                    instance.source = instance.repostSource
                } else if(instance.sourceType === 'Like' && instance.likeSource) {
                    instance.source = instance.likeSource;
                } else if(instance.sourceType === 'Comment' && instance.commentSource) {
                    instance.source = instance.commentSource;
                } else if(instance.sourceType === 'Follow' && instance.followSource) {
                    instance.source = instance.followSource;
                }
            }

            delete instance.postSource;
            delete instance.likeSource;
            delete instance.commentSource;
            delete instance.followSource;
        }
    }
});


module.exports = Notification;