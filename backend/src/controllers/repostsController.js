const Post = require("../models/post");
const Repost = require("../models/repost");

// 1. Import catchAsync and custom errors
const catchAsync = require('../utils/catchAsync'); 
const { NotFoundError } = require('../utils/errorResponse'); // Adjust path as needed


const toggle_repost = catchAsync(async (req, res, next) => {
    const { post_id } = req.params;
    const { username } = req.user;

    // Ensure the post exists
    const post = await Post.findByPk(post_id);
    if (!post) {
        throw new NotFoundError("Post");
    }

    // Check whether the user has already reposted this post
    const existing_repost = await Repost.findOne({
        where: { post: post_id, user: username }
    });

    if (existing_repost) {
        // Undo repost
        await existing_repost.destroy();
        return res.status(200).json({ message: "Repost undone" });
    }

    // Create repost
    await Repost.create({
        post: post_id,
        user: username
    });

    return res.status(201).json({ message: "Reposted" });
});


const check_user_repost = catchAsync(async (req, res, next) => { // Wrapped
    const { post_id } = req.params;
    const { username } = req.user;

    // find post
    const post = await Post.findByPk(post_id);

    if(!post) {
        throw new NotFoundError("Post");
    }

    const has_reposted = await Repost.findOne({ where: { user: username, post: post_id }});

    return res.status(200).json({ reposted: !!has_reposted });
}); // Removed try...catch

const get_repost_count = catchAsync(async (req, res, next) => { // Wrapped
    const { post_id } = req.params;

    const post = await Post.findByPk(post_id);
    if (!post) {
        throw new NotFoundError("Post");
    }

    const count = await Repost.count({ where: { post: post_id } });

    return res.status(200).json({ repost_count: count });
}); // Removed try...catch


module.exports = { toggle_repost, check_user_repost, get_repost_count };