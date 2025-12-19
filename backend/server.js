require('dotenv').config({ path: './.env'});

const http = require('http');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Internal Imports
const { initSocket } = require('./src/socket/socket.js');
const { init } = require('./src/config/database');
const { sync_tables } = require('./src/models');
const errorHandler = require('./src/middleware/errorHandler.js');

const app = express();
const server = http.createServer(app);

// 1. Middleware Setup
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// 2. Routes Setup
app.use('/api/auth', require('./src/routes/authRoute.js'));
app.use('/api/profile', require('./src/routes/userRoute.js'));
app.use('/api/posts', require('./src/routes/postsRoute.js'));
app.use('/api/likes', require('./src/routes/likesRoute.js'));
app.use('/api/reposts', require('./src/routes/repostRoute.js'));
app.use('/api/comments', require('./src/routes/commentRoute.js'));
app.use('/api/notifications', require('./src/routes/notifications.route.js'));
app.use('/api/users', require('./src/routes/otheruserRoute.js'));
app.use('/api/following', require('./src/routes/followRoutes.js'));
app.use(errorHandler);

// 3. Event Listeners
require("./src/listeners/notificationListener.js");
require("./src/listeners/likeEventListener.js");
require("./src/listeners/repostEventListeners.js");

// 4. THE STARTUP SEQUENCE
const startServer = async () => {
    try {
        // Connect to the Database
        await init(); 

        // Sync the Tables
        await sync_tables(); 

        // Initialize Socket.io
        initSocket(server);

        // Start the Server
        const PORT = process.env.PORT || 8000;
        server.listen(PORT, () => {
            console.log(`Server listening at http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("CRITICAL ERROR DURING STARTUP:", error);
        process.exit(1);
    }
};

// Execute the startup sequence
startServer();

// Handle unexpected rejections
process.on('unhandledRejection', (err) => {
    console.log(`Unhandled Rejection: ${err}`);
    server.close(() => process.exit(1));
});