const Post = require("../models/post");
const Repost = require("../models/repost");

// 1. Import catchAsync and custom errors
const catchAsync = require('../utils/catchAsync'); 
const { NotFoundError } = require('../utils/errorResponse'); // Adjust path as needed


const make_repost = catchAsync(async (req, res, next) => { // Wrapped
    const { post_id } = req.params;
    const { username } = req.user;

    // find post
    const post = await Post.findByPk(post_id);

    if(!post) {
        throw new NotFoundError("Post");
    }

    // create repost
    await Repost.create({
        post: post_id,
        user: username
    });

    return res.status(201).json({ message: "Reposted" });
}); // Removed try...catch


const undo_repost = catchAsync(async (req, res, next) => { // Wrapped
    const { post_id } = req.params;
    const { username } = req.user;

    // find repost
    const repost = await Repost.findOne({
        where: { post: post_id, user: username }
    });

    if (!repost) {
        throw new NotFoundError("Repost");
    }

    // delete repost
    await repost.destroy();

    return res.status(200).json({ message: "Repost undone" });
}); // Removed try...catch


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


module.exports = { make_repost, undo_repost, check_user_repost, get_repost_count };