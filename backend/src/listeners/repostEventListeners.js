

const repostEvents = require('../events/repostEvent');
const { getIO, getUserSockets } = require('../socket/socket');



repostEvents.on('post.reposted', async ({receiver, actor, post}) => {
    try {
        const io = getIO();
        const sockets = getUserSockets(receiver);

        if(sockets.length === 0) {
            console.log(`User ${receiver} is offline, storing only`);
            return; // no real-time push needed
        }

        sockets.forEach(socket => {
            io.to(socket).emit("repost:update", { post, actor });
        });

        console.log(`Event emitted ${receiver} about a like`)
    } catch (error) {
        console.error(`Error in post.reposted event listener: ${error}`);
    }
});

repostEvents.on('repost.undone', async ({receiver, actor, post}) => {
    try {
        const io = getIO();
        const sockets = getUserSockets(receiver);

        if(sockets.length === 0) {
            console.log(`User ${receiver} is offline, storing only`);
            return; // no real-time push needed
        }

        sockets.forEach(socket => {
            io.to(socket).emit("repost:update", { post, actor });
        });

        console.log(`Event emitted ${receiver} about an un-repost`)
    } catch (error) {
        console.error(`Error in post.reposted event listener: ${error}`);
    }
});