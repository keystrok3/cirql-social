const Notification = require("../models/notifications");
const User = require("../models/user");
const PostLike = require("../models/like");

const fetch_notifications = async (req, res) => {
    const { username } = req.user;

    try {

        const notifications = await Notification.findAll({
            where: { 
                receiver: username 
            },
            include: [
                {
                    model: User,
                    as: 'actorInfo',
                    attributes: [ 'username', 'profile_photo' ]
                },
                {
                    model: PostLike,
                    as: 'likeSource',
                    attributes: ['post_id']
                }
            ],
            order: [[ 'createdAt', 'DESC' ]]
        });

        return res.status(200).json({ notifications});
    } catch (error) {
        console.error('Error fetching notifications: ', error);
        res.status(500).json({ message: "Server Error fetching notifications" });
    }
};


const mark_notifications_read = async (req, res) => {
    const { username } = req.user;

    try {
        const unread_notifications = await Notification.update(
            { is_read: true },
            {
                where: {
                    receiver: username,
                    is_read: false
                }
        })
        
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error notifications read');
        return res.status(500).json({ msg: "Server Error notifications read" });
    }
};


module.exports = { fetch_notifications, mark_notifications_read };