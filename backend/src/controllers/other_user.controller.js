const Post = require("../models/post");
const User = require("../models/user");
const PostLike = require("../models/like"); 
const Repost = require("../models/repost"); 
const catchAsync = require("../utils/catchAsync");
const { NotFoundError } = require("../utils/errorResponse");

/** Fetch user profile */ 
const fetchProfile = async (req, res, next) => {
  
    const { username } = req.params;

    try {
        const user = await User.findByPk(username);

        if(!user) {
            res.status(404).json({ message: 'No such user' });
        }
        
        return res.status(200).json({ 
            user: { 
                username: user.username,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                bio: user.bio,
                profile_photo: user.profile_photo,
                banner_image: user.banner_image
            } 
        });
    } catch (error) {
        console.log('Error fetching user: ', error);
        res.status(500).json({ message: "Server Error" });
    }
};

/** Fetch user posts */ 
const fetch_users_posts = catchAsync(async (req, res, next) => {

    const { username } = req.params;

    const user = await User.findByPk(username);

    if(!user) {
        throw new NotFoundError("User");
    }

    const posts = await Post.findAll({ where: { user: username }, order: [['createdAt', 'DESC']] });

    return res.status(200).json(posts);

});


/** Fetch all posts liked by the user in req.params */ 
const fetch_users_liked_posts = catchAsync(async (req, res, next) => {
    const { username } = req.params;

    const user = await User.findByPk(username);

    if(!user) {
        throw new NotFoundError("User");
    }

    const likes = await PostLike.findAll({ 
        where: { user: username },
        order: [['createdAt', 'DESC']]
    });

    const post_ids = likes.map(like => like.post_id);

    const liked_posts = await Post.findAll({
        where: { post_id: post_ids },
        order: [['createdAt', 'DESC']]
    });
    
    return res.status(200).json(liked_posts);
});


/** Fetch all posts reposted by the user in req.params */
const fetch_users_reposts = catchAsync(async (req, res, next) => {
    const { username } = req.params;

    const user = await User.findByPk(username);

    if(!user) {
        throw new NotFoundError("User");
    }

    const reposts = await Repost.findAll({ 
        where: { user: username },
        order: [['createdAt', 'DESC']]
    });

    const post_ids = reposts.map(repost => repost.post);

    const reposted_posts = await Post.findAll({
        where: { post_id: post_ids },
        order: [['createdAt', 'DESC']]
    });

    return res.status(200).json(reposted_posts);
});


module.exports = { fetchProfile, fetch_users_posts, fetch_users_liked_posts, fetch_users_reposts };