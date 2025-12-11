const notificationEvent = require("../events/notificationEvent");
const repostEvent = require("../events/repostEvent");
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

        repostEvent.emit("repost.undone", {
            receiver: post.user,
            actor: username,
            repostId: existing_repost.repost_id,
            post: existing_repost.post
        })
        return res.status(200).json({ message: "Repost undone" });
    }

    // Create repost
    const repost = await Repost.create({
        post: post_id,
        user: username
    });


    if(repost.user !== post.user) {
        notificationEvent.emit("notification.created", {
            receiver: post.user,
            actor: username,
            notification_type: "Repost",
            source_id: repost.repost_id,
            sourceType: "Repost"
        });

        repostEvent.emit("post.reposted", {
            receiver: post.user,
            actor: username,
            repostId: repost.repost_id,
            post: repost.post
        })
    }

    return res.status(201).json({ message: "Reposted" });
});


const check_user_repost = catchAsync(async (req, res, next) => {
    const { post_id } = req.params;
    const { username } = req.user;

    // find post
    const post = await Post.findByPk(post_id);

    if(!post) {
        throw new NotFoundError("Post");
    }

    const has_reposted = await Repost.findOne({ where: { user: username, post: post_id }});

    return res.status(200).json({ reposted: !!has_reposted });
});

const get_repost_count = catchAsync(async (req, res, next) => { // Wrapped
    const { post_id } = req.params;

    const post = await Post.findByPk(post_id);
    if (!post) {
        throw new NotFoundError("Post");
    }

    const count = await Repost.count({ where: { post: post_id } });

    return res.status(200).json({ repost_count: count });
});



module.exports = { toggle_repost, check_user_repost, get_repost_count };