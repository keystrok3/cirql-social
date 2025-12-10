const Follows = require("../models/user_follows");
const User = require("../models/user");

const catchAsync = require('../utils/catchAsync');
const { NotFoundError, AppError } = require('../utils/errorResponse');

/**
 * Helper to check if a user exists
 * */
const checkUserExists = async (username, type = "User") => {
    const user = await User.findByPk(username);
    if (!user) {
        throw new NotFoundError(type);
    }
    return user;
};

/**
 * Toggles a follow instance: follows if not following, unfollows if currently following.
 * */
const toggle_follow = catchAsync(async (req, res, next) => { // Wrapped
    const loggedInUsername = req.user.username;
    const targetUsername = req.params.username;

    if (loggedInUsername === targetUsername) {
        // Use AppError for specific 400 status codes
        throw new AppError("Cannot follow yourself", 400, "ValidationError");
    }

    // Check if both users exist
    await checkUserExists(loggedInUsername, "Logged in user");
    await checkUserExists(targetUsername, "User");

    const existingFollow = await Follows.findOne({
        where: { user: loggedInUsername, follows: targetUsername }
    });

    let message;
    let statusCode;

    if (existingFollow) {
        // --- UNFOLLOW Logic ---
        await existingFollow.destroy();
        message = `Successful unfollow of ${targetUsername}`;
        statusCode = 200;
        console.log(`User ${loggedInUsername} successfully unfollowed user ${targetUsername}`);
    } else {
        // --- FOLLOW Logic ---
        await Follows.create({ user: loggedInUsername, follows: targetUsername });
        message = `User ${targetUsername} followed`;
        statusCode = 201;
        console.log(`User ${loggedInUsername} successfully followed user ${targetUsername}`);
    }

    return res.status(statusCode).json({ message });
});


/**
 * Get all the users a specific user is following
 * */
const fetch_user_following = catchAsync(async (req, res, next) => {
    const { username } = req.params;

    const userWithFollowing = await User.findByPk(username, {
        include: [{
            model: Follows,
            as: 'Following',
            include: [{
                model: User,
                as: 'Followee',
                attributes: [ 'username', 'screen_name', 'profile_photo' ]
            }]
        }]
    });

    if(!userWithFollowing) {
        throw new NotFoundError("User");
    }

    const followedUsers = userWithFollowing.Following.map(f => f.Followee);

    return res.status(200).json(followedUsers);
});


/**
 * Fetch all the followers of a specific user
 * */
const getFollowers = catchAsync(async (req, res) => {
    const { username } = req.params;

    const userWithFollowers = await User.findByPk(username, {
        include: [{
            model: Follows,
            as: 'Followers',
            include: [{
                model: User,
                as: 'Follower',
                attributes: ['username', 'screen_name', 'profile_photo']
            }]
        }]
    });

    if (!userWithFollowers) {
        throw new NotFoundError("User");
    }

    const followerUsers = userWithFollowers.Followers.map(f => f.Follower);

    return res.status(200).json(followerUsers);
});

module.exports = { toggle_follow, fetch_user_following, getFollowers };