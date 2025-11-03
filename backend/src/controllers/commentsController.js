const Post = require("../models/post");
const Comment = require("../models/comments");

const create_comment = async (req, res, next) => {
    try {
        const { username } = req.user;
        const { post_id } = req.param;
        const { content } = req.body;

        // find post
        const post = await Post.findByPk(post_id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        // create post
        await Comment.create({
            user: username,
            post_id: post_id,
            content: content
        });

        console.log('Comment posted');

        return res.status(201).json({ message: "Comment created" });

    } catch (error) {
        console.log('Error posting comment: ', error);
        return res.status(500).json({ message: "Server Error" });
    }
};


const fetch_comment_count = async (req, res, next) => {
    try {
        const { post_id } = req.params;

        // find post
        const post = await Post.findByPk(post_id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        // fetch comment count
        const comment_count = await Comment.count({ where: { post_id: post_id }});
        
        return res.status(200).json({ post_id, comments: comment_count });

    } catch (error) {
        console.error("Error fetch comment count: ", error);
        return res.status(500).json({ message: "Server Error"})
    }
};

module.exports = { create_comment, fetch_comment_count };