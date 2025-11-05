const PostLike = require("../models/like");
const Post = require("../models/post");
const catchAsync = require('../utils/catchAsync');
const { NotFoundError, DatabaseError } = require('../utils/errorResponse');

const like_post = catchAsync(async (req, res, next) => {
    const { post_id } = req.params;
    const { username } = req.user;

    const post = await Post.findByPk(post_id);

    if(!post) {
        throw new NotFoundError("Post"); 
    }

    const liked = await PostLike.create({
        post_id: post_id,
        user: username
    });

    return res.status(201).json({ message: "Post liked" });
});

const unlike_post = catchAsync(async (req, res, next) => {
    const { post_id } = req.params;
    const { username } = req.user;

    const post = await Post.findByPk(post_id);

    if(!post) {
        throw new NotFoundError("Post");
    }

    const find_user_like = await PostLike.findOne({ where: { post_id, user: username }});
    
    // Note: I've corrected the findOne query to also include post_id, 
    // as you want to ensure the like belongs to both the user AND the post.

    if(!find_user_like) {
        // If the like doesn't exist, we can still report success (idempotence) 
        // or indicate it was already "deleted." Let's use the latter for clarity.
        // I will throw a 404 NotFoundError here, but you might decide to return a 200/204 instead
        throw new NotFoundError("Like"); 
    }

    await find_user_like.destroy();

    return res.status(204).json({ message: "Unliked" }); // Using 204 No Content for successful deletion
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
    like_post,
    unlike_post,
    get_post_likes_count,
    has_user_liked_post
};