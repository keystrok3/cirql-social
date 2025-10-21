const Follows = require("../models/user_follows");

const User = require("../models/user");

/**
 * Create a follow instance
 * */
const follow_user = async (req, res, next) => {
    const { username } = req.user;
    const user_to_follow = req.params.username;

    if (username === user_to_follow) {
        return res.status(400).json({ message: "Cannot follow yourself" });
    }

    try {
        const user = await User.findByPk(username); // logged in user 

        if (!user) {
            return res.status(404).json({ message: "No such logged in user" });
        }

        const user_followed = await User.findByPk(user_to_follow);

        if (!user_followed) {
            return res.status(404).json({ message: "No such user" });
        }

        const existingFollow = await Follows.findOne({
            where: { user: username, follows: user_to_follow }
        });

        if (existingFollow) {
            return res.status(409).json({ message: `User ${user_to_follow} is already being followed` });
        }
        
        await Follows.create({ user: username, follows: user_to_follow });
        console.log(`User ${username} successfully followed user ${user_to_follow}`);

        return res.status(201).json({ message: `User ${user_to_follow} followed` });

    } catch (error) {
        console.error('Unexpected error following user', error);
        return res.status(500).json({ message: `Unexpected server error` });
    }
};

/**
 * Remove follow user instance
 * */ 
const unfollow_user = async (req, res, next) => {
    const { username } = req.user;
    const user_to_unfollow = req.params.username;

    try {
        const user = await User.findByPk(username); // logged in user 

        if (!user) {
            return res.status(404).json({ message: "No such logged in user" });
        }

        const user_unfollowed = await User.findByPk(user_to_unfollow);

        if (!user_unfollowed) {
            return res.status(404).json({ message: "No such user" });
        }

        const following_instance = await Follows.findOne({ 
            where: {
                user: username,
                follows: user_to_unfollow
            }
        });

        if (!following_instance) {
            return res.status(404).json({ message: `You are not currently following ${user_to_unfollow}` });
        }

        await following_instance.destroy();

        return res.status(200).json({ message: `Successful unfollow of ${user_to_unfollow}` });

    } catch (error) {
        console.error('Error unfollowing', error);
        res.status(500).json({ message: "Server Error" });
    }
};


/**
 * The all the users a specific user is following
 * */ 
const fetch_user_following = async (req, res, next) => {
    const { username } = req.user;

    try {
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
            return res.status(404).json({ message: "User not found" });
        }

        const followedUsers = userWithFollowing.Following.map(f => f.Followee);

        return res.status(200).json(followedUsers);
        
    } catch (error) {
        console.error('Error fetching following list:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * Fetch all the followers of a specific logged in user
 * 
*/
const getFollowers = async (req, res) => {
    const { username } = req.user; 

    try {
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
            return res.status(404).json({ message: "User not found" });
        }

        const followerUsers = userWithFollowers.Followers.map(f => f.Follower);
        
        return res.status(200).json(followerUsers);

    } catch (error) {
        console.error('Error fetching followers list:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { follow_user, unfollow_user, fetch_user_following, getFollowers };