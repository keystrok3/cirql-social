
require('dotenv').config({ path: './.env'});

const http = require('http');
const { initSocket } = require('./src/socket/socket.js');

const cookieParser = require('cookie-parser');
const cors = require('cors');

const express = require('express');


const { init } = require('./src/config/database');
const { sync_tables } = require('./src/models');
const errorHandler = require('./src/middleware/errorHandler.js');


const app = express();

const server = http.createServer(app);


// Initialize database 
init();

// sync tables
sync_tables();

require("./src/listeners/notificationListener.js");
require("./src/listeners/likeEventListener.js");

// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static('uploads'));

//Routes
app.use('/api/auth', require('./src/routes/authRoute.js'));
app.use('/api/profile', require('./src/routes/userRoute.js'));
app.use('/api/posts', require('./src/routes/postsRoute.js'));
app.use('/api/likes', require('./src/routes/likesRoute.js'));
app.use('/api/reposts', require('./src/routes/repostRoute.js'));
app.use('/api/comments', require('./src/routes/commentRoute.js'));
app.use('/api/notifications', require('./src/routes/notifications.route.js'));
app.use(errorHandler)


// Initialize WebSocket server
initSocket(server);

server.listen(
    process.env.PORT, 
    () => console.log(`Server listening at http://localhost:${process.env.PORT}`)
);

// handle server errors
process.on('unhandledRejection', (err, promise) => {
    console.log(`Server Error: ${err}`);
    server.close(() => process.exit(1));
});

