const Notification = require("../models/notifications");

const fetch_notifications = async (req, res) => {
    const { username } = req.user;

    try {

        const notifications = await Notification.findAll({ where: { receiver: username }});
        console.log('Notifications: ', notifications)
        return res.status(200).json({ notifications});
    } catch (error) {
        console.error('Error fetching notifications: ', error);
        res.status(500).json({ message: "Server Error fetching notifications" });
    }

};


module.exports = { fetch_notifications };