const Follows = require("../models/user_follows");
const User = require("../models/user");

// 1. Import catchAsync and custom errors
const catchAsync = require('../utils/catchAsync'); 
const { NotFoundError, AppError } = require('../utils/errorResponse'); // Adjust path as needed


/**
 * Create a follow instance
 * */
const follow_user = catchAsync(async (req, res, next) => { // Wrapped
    const { username } = req.user;
    const user_to_follow = req.params.username;

    if (username === user_to_follow) {
        // Use AppError for specific 400 status codes
        throw new AppError("Cannot follow yourself", 400, "ValidationError"); 
    }

    const user = await User.findByPk(username); // logged in user 

    if (!user) {
        // Logged-in user should ideally be guaranteed by authentication middleware, but we handle the check with a 404
        throw new NotFoundError("Logged in user");
    }

    const user_followed = await User.findByPk(user_to_follow);

    if (!user_followed) {
        throw new NotFoundError("User");
    }

    const existingFollow = await Follows.findOne({
        where: { user: username, follows: user_to_follow }
    });

    if (existingFollow) {
        // Use AppError for 409 Conflict status
        throw new AppError(`User ${user_to_follow} is already being followed`, 409, "ConflictError");
    }
    
    await Follows.create({ user: username, follows: user_to_follow });
    console.log(`User ${username} successfully followed user ${user_to_follow}`);

    return res.status(201).json({ message: `User ${user_to_follow} followed` });

}); // Removed try...catch


/**
 * Remove follow user instance
 * */ 
const unfollow_user = catchAsync(async (req, res, next) => { // Wrapped
    const { username } = req.user;
    const user_to_unfollow = req.params.username;

    const user = await User.findByPk(username); // logged in user 

    if (!user) {
        throw new NotFoundError("Logged in user");
    }

    const user_unfollowed = await User.findByPk(user_to_unfollow);

    if (!user_unfollowed) {
        throw new NotFoundError("User");
    }

    const following_instance = await Follows.findOne({ 
        where: {
            user: username,
            follows: user_to_unfollow
        }
    });

    if (!following_instance) {
        // Return 404/NotFoundError for the follow relationship itself
        throw new NotFoundError(`You are not currently following ${user_to_unfollow}`);
    }

    await following_instance.destroy();

    return res.status(200).json({ message: `Successful unfollow of ${user_to_unfollow}` });
}); // Removed try...catch


/**
 * The all the users a specific user is following
 * */ 
const fetch_user_following = catchAsync(async (req, res, next) => { // Wrapped
    const { username } = req.user;

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
}); // Removed try...catch


/**
 * Fetch all the followers of a specific logged in user
 * */
const getFollowers = catchAsync(async (req, res) => { // Wrapped
    const { username } = req.user; 

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
}); // Removed try...catch

module.exports = { follow_user, unfollow_user, fetch_user_following, getFollowers };