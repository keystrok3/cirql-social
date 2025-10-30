const PostLike = require("../models/like");
const Post = require("../models/post");



const like_post = async (req, res, next) => {
    try {
        const { post_id } = req.params;
        const { username } = req.user;

        const post = await Post.findByPk(post_id);

        if(!post) {
            return res.status(404).json({ message: "Post doesn't exist" });
        }

        const liked = await PostLike.create({
            post_id: post_id,
            user: username
        });

        return res.status(201).json({ message: "Post liked" });

    } catch (error) {
        console.error('Server error liking post: ', error);
        res.status(500).json({ message: "Unexpected Error" });
    }
};

const unlike_post = async (req, res, next) => {
    try {
        const { post_id } = req.params;
        const { username } = req.user;

        const post = await Post.findByPk(post_id);

        if(!post) {
            return res.status(404).json({ message: "Post doesn't exist" });
        }

        const find_user_like = await PostLike.findOne({ where: { user: username }});

        if(!find_user_like) {
            return res.status(404).json({ message: "Like deleted" });
        }

        await find_user_like.destroy();

        return res.status(201).json({ message: "Unliked" });

    } catch (error) {
        console.error('Error unliking: ', error);
        res.status(500).json({ message: "ServerError" });
    }
}

const get_post_likes_count = async (req, res, next) => {
    try {
        const { post_id } = req.params;

        const post = await Post.findByPk(post_id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const count = await PostLike.count({ where: { post_id } });
        return res.status(200).json({ post_id, likes: count });
    } catch (error) {
        console.error("Error fetching post like count:", error);
        res.status(500).json({ message: "Unexpected Error" });
    }
};

const has_user_liked_post = async (req, res, next) => {
    try {
        const { post_id } = req.params;
        const { username } = req.user;

        const post = await Post.findByPk(post_id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const like = await PostLike.findOne({ where: { post_id, user: username } });
        return res.status(200).json({ liked: !!like });
    } catch (error) {
        console.error("Error checking user like:", error);
        res.status(500).json({ message: "Unexpected Error" });
    }
};

module.exports = {
    like_post,
    unlike_post,
    get_post_likes_count,
    has_user_liked_post
};
