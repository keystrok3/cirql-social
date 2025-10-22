
const User = require('../models/user.js');
const OutstandingTokens = require('../models/outstandingtokens.js');
const BlacklistedTokens = require('../models/blacklistedtokens.js');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { Op } = require('sequelize');
const { generateAccessToken, generateRefreshToken } = require('../utils/generate_jwt_tokens.js');




/**
 * Create a user
 * */ 
const createUser = async (req, res, next) => {
    
    const { username, email, first_name, last_name, password } = req.body;

    try {
        const user = await User.findOne({ 
            where: {
                [Op.or]: [
                    { email: email },
                    { username: username }
                ]
            }}
        );
        
        if(user) {
            return res.status(409).json({ "message": "Username or Email already exists" })
        }

        await User.create({
            username: username, 
            email: email,
            first_name: first_name,
            last_name: last_name,
            password: password
        });

        return res.status(200).json({ "message": "User created" });

    } catch (error) {
        console.log(`Error creating user: ${error}`);
        res.status(500).json({ 'message': 'Unexpected error occured' })
    }
};



/**
 * Login user
 * */ 
const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email: email }});

        if(!user) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const check_password = await bcrypt.compare(password, user.password);

        if(!check_password) {
            return res.status(401).json({ message: "Invalid Credentials"});
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
            path: "/refresh",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({  
            user: { 
                username: user.usename,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name
            }, 
            token: access_token });

    } catch (error) {
        console.log(`Error logging in: ${error}`);

        res.status(500).json({ message: "Unexpected error" });
    }
};



const logout = async (req, res, next) => {
    try {
        const refreshToken = res.cookies?.refreshToken;

        const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

        // find the outstanding token
        const outstanding_token = await OutstandingTokens.findOne({ where: { token: hashedToken }});

        if(!outstanding_token) {
            console.error(`Token not found to blacklist`);
            return res.status(404).json({ message: "Something went wrong" });
        }

        await BlacklistedTokens.create({
            token: outstanding_token.id
        });

        res.status(200).json({ 'message': 'Successfully Logged out' });

    } catch (error) {
        console.error(`Error logging out: ${error}`);
        res.status(500).json({ 'message': 'Unexpected Error Logging out' });
    }
};

const refresh_token = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken; 
    if (!refreshToken) {
      return res.status(401).json({ message: "No token provided" });
    }

    let payload;
    try {
        console.log('Verifying refresh token...');
      payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const tokenRecord = await OutstandingTokens.findOne({
      where: { token: hashedToken }
    });

    if (!tokenRecord) {
      return res.status(401).json({ message: 'Token not recognized' });
    }

    const isblacklisted = await BlacklistedTokens.findByPk(tokenRecord.id);

    if(isblacklisted) {
        return res.status(401).json({ message: "Token blacklisted" });
    }

    console.log('Refresh token: ', payload)
 
    const newAccessToken = generateAccessToken({ username: payload.user });

    return res.status(201).json({ access_token: newAccessToken });

  } catch (error) {
    console.error(`Error refreshing token: ${error}`);
    return res.status(500).json({ message: "Unexpected error occurred" });
  }
};


module.exports = { createUser, login, logout, refresh_token };