const User = require('../models/user.js');
const OutstandingTokens = require('../models/outstandingtokens.js');
const BlacklistedTokens = require('../models/blacklistedtokens.js');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { Op } = require('sequelize');
const { generateAccessToken, generateRefreshToken } = require('../utils/generate_jwt_tokens.js');

// 1. Import catchAsync and custom errors
const catchAsync = require('../utils/catchAsync'); 
const { AuthenticationError, NotFoundError, AppError } = require('../utils/errorResponse'); // Adjust path as needed

/**
 * Create a user
 * */ 
const createUser = catchAsync(async (req, res, next) => { // Wrapped
    
    const { username, email, first_name, last_name, password } = req.body;

    const user = await User.findOne({ 
        where: {
            [Op.or]: [
                { email: email },
                { username: username }
            ]
        }}
    );
    
    if(user) {
        // Use a 409 Conflict status code, wrapping it in an AppError
        throw new AppError("Username or Email already exists", 409, "ConflictError");
    }

    await User.create({
        username: username, 
        email: email,
        first_name: first_name,
        last_name: last_name,
        password: password
    });

    return res.status(200).json({ "message": "User created" });

}); // Removed try...catch


/**
 * Login user
 * */ 
const login = catchAsync(async (req, res, next) => { // Wrapped
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email }});

    if(!user) {
        // Use AuthenticationError for invalid credentials (401)
        throw new AuthenticationError("Invalid Credentials");
    }

    const check_password = await bcrypt.compare(password, user.password);

    if(!check_password) {
        throw new AuthenticationError("Invalid Credentials");
    }

    // Generate JWT token
    const access_token = generateAccessToken(user);
    const refresh_token = generateRefreshToken(user);

    // hash refresh token
    const hashedToken = crypto.createHash('sha256').update(refresh_token).digest('hex');

    // Store refresh token
    await OutstandingTokens.create({
        username: user.username,
        token: hashedToken
    })

    res.cookie("refreshToken", refresh_token, {
        httpOnly: true,
        secure: process.env.ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({  
        user: { 
            username: user.username, // Corrected typo: user.usename to user.username
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name
        }, 
        token: access_token });

}); // Removed try...catch


const logout = catchAsync(async (req, res, next) => { // Wrapped
    const refreshToken = req.cookies?.refreshToken;

    // A simple check if refreshToken exists before trying to hash it
    if (!refreshToken) {
        return res.status(200).json({ 'message': 'Successfully Logged out (no token to clear)' });
    }

    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

    // find the outstanding token
    const outstanding_token = await OutstandingTokens.findOne({ where: { token: hashedToken }});

    if(!outstanding_token) {
        console.error(`Token not found to blacklist`);
        // Return 200/404 based on desired behavior, using 404 for clarity here
        throw new NotFoundError("Outstanding token");
    }

    await BlacklistedTokens.create({
        token: outstanding_token.id
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.ENV === "production",
        sameSite: "strict",
        path: "/",
    });
    
    res.status(200).json({ 'message': 'Successfully Logged out' });

}); // Removed try...catch


const verifyToken = async (req, res, next) => {
  // This function deals mostly with JWT verification errors, not DB errors, 
  // so keeping the explicit try...catch to handle JWT specific errors (TokenExpiredError, JsonWebTokenError) is appropriate.
  // We'll keep the original structure but clean up the status codes.

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new AuthenticationError("No token provided")); // Use AppError for better standardization
  }

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    return res.status(200).json({ message: "Success" });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AuthenticationError('Token expired')); // Handled by AppError/errorHandler
    } else if (error.name === 'JsonWebTokenError') {
      return next(new AuthenticationError('Invalid token')); // Handled by AppError/errorHandler
    }

    // For truly unexpected errors
    console.error('Error verifying token:', error);
    return next(error); 
  }
};


const refresh_token = catchAsync(async (req, res) => { // Wrapped
    const refreshToken = req.cookies?.refreshToken; 
    if (!refreshToken) {
        throw new AuthenticationError("No token provided");
    }

    let payload;
    try {
        console.log('Verifying refresh token...');
        payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        throw new AuthenticationError("Invalid or expired token");
    }

    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const tokenRecord = await OutstandingTokens.findOne({
        where: { token: hashedToken }
    });

    if (!tokenRecord) {
        throw new AuthenticationError('Token not recognized');
    }

    const isblacklisted = await BlacklistedTokens.findByPk(tokenRecord.id);

    if(isblacklisted) {
        throw new AuthenticationError("Token blacklisted");
    }

    console.log('Refresh token: ', payload)
 
    const newAccessToken = generateAccessToken({ username: payload.username });

    return res.status(201).json({ access_token: newAccessToken });
});


module.exports = { createUser, login, logout, refresh_token, verifyToken };