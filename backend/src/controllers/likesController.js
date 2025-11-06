const PostLike = require("../models/like");
const Post = require("../models/post");
const catchAsync = require('../utils/catchAsync');
const { NotFoundError, DatabaseError } = require('../utils/errorResponse');

const toggle_like_post = catchAsync(async (req, res, next) => {
    const { post_id } = req.params;
    const { username } = req.user;

    // Ensure the post exists
    const post = await Post.findByPk(post_id);
    if (!post) {
        throw new NotFoundError("Post");
    }
    
    // Check if the user already liked the post
    const existing_like = await PostLike.findOne({
        where: { post_id, user: username }
    });

    if (existing_like) {
        // Unlike
        await existing_like.destroy();
        return res.status(200).json({ message: "Unliked" });
    }

    // Like
    await PostLike.create({
        post_id,
        user: username
    });

    return res.status(201).json({ message: "Post liked" });
});


const get_post_likes_count = catchAsync(async (req, res, next) => {
    const { post_id } = req.params;

    const post = await Post.findByPk(post_id);
    if (!post) {
        throw new NotFoundError("Post");
    }

    const count = await PostLike.count({ where: { post_id } });
    return res.status(200).json({ post_id, likes: count });
});

const has_user_liked_post = catchAsync(async (req, res, next) => {
    const { post_id } = req.params;
    const { username } = req.user;

    const post = await Post.findByPk(post_id);
    if (!post) {
        throw new NotFoundError("Post");
    }

    const like = await PostLike.findOne({ where: { post_id, user: username } });
    return res.status(200).json({ liked: !!like });
});

module.exports = {
    toggle_like_post,
    get_post_likes_count,
    has_user_liked_post
};