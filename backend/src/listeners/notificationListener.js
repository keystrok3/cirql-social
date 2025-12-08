
const notificationEvents = require('../events/notificationEvent');
const Notification = require('../models/notifications');

const { getIO, getUserSockets } = require('../socket/socket');




notificationEvents.on("post.commented", async ({ receiver, actor, commentId }) => {

  const notification = await Notification.create({
    receiver,
    actor: actor,
    notification_type: "comment",
    source_id: commentId,
    sourceType: "Comment",
    is_read: false,
  });

    // emit to WebSocket client
    const io = getIO();
    const sockets = getUserSockets(receiver);

    sockets.forEach(socketId => {
        io.to(socketId).emit("notification", notification)
    })

  console.log(`Notification created for ${receiver} about a comment`);
});


notificationEvents.on("notification.created", async (payload) => {
    try {
        // 1. Store notification in database
        const notification = await Notification.create({
            receiver: payload.receiver,       
            actor: payload.actor,      
            notification_type: payload.notification_type, 
            source_id: payload.source_id,
            sourceType: payload.sourceType,
            is_read: false
        });

        console.log("Notification saved:", notification.id);

        // 2. Push notification to the receiver via WebSocket
        const io = getIO();
        const sockets = getUserSockets(payload.receiver);

        if(sockets.length === 0) {
            console.log(`User ${payload.receiver} is offline, storing only`);
            return; // no real-time push needed
        }

        sockets.forEach(socketId => {
            io.to(socketId).emit("notification", {
                id: notification.id,
                actor: notification.actor,
                notification_type: notification.notification_type,
                source_id: notification.source_id,
                sourceType: notification.sourceType,
                createdAt: notification.createdAt,
            })
        });

        console.log(`Real-time ${payload.notification_type} notification sent to ${payload.receiver}`);


    } catch (error) {
        console.error("Error in notification listener:", error);
    }
})