
require('dotenv').config({ path: './.env'});
const cookieParser = require('cookie-parser');
const cors = require('cors');

const express = require('express');


const { init } = require('./src/config/database');
const { sync_tables } = require('./src/models');


const app = express();


// Initialize database 
init();

// sync tables
sync_tables();


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



const server = app.listen(
    process.env.PORT, 
    () => console.log(`Server listening at http://localhost:${process.env.PORT}`)
);

// handle server errors
process.on('unhandledRejection', (err, promise) => {
    console.log(`Server Error: ${err}`);
    server.close(() => process.exit(1));
});

