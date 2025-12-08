const likeEvent = require("../events/likeEvent");
const { getIO, getUserSockets } = require('../socket/socket');

/**
 * Emits an event that a post has been liked
*/
likeEvent.on("post.liked", async ({ receiver, actor, likeId, post}) => {

    try {
        // emit to WebSocket client
        const io = getIO();
        const sockets = getUserSockets(receiver);

        if(sockets.length === 0) {
            console.log(`User ${receiver} is offline, storing only`);
            return; // no real-time push needed
        }
        console.log(`liked listener post_id: ${post}`);
        sockets.forEach(socketId => {
            io.to(socketId).emit("like:update", { post, actor })
        })


        console.log(`Event created for ${receiver} about a like`);
    } catch (error) {
        console.error(`Error in post.liked event listener: ${error}`);
    }
});


/**
 * Emits an event that a post has been liked
*/
likeEvent.on("post.unliked", async ({ receiver, actor, likeId, post}) => {

    try {
        // emit to WebSocket client
        const io = getIO();
        const sockets = getUserSockets(receiver);

        if(sockets.length === 0) {
            console.log(`User ${receiver} is offline, storing only`);
            return; // no real-time push needed
        }

        sockets.forEach(socketId => {
            io.to(socketId).emit("like:update", { post, actor })
        })


        console.log(`Event created for ${receiver} about an unlike`);
    } catch (error) {
        console.error(`Error in post.unliked event listener: ${error}`);
    }
});
