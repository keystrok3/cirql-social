const Post = require("../models/post");
const Comment = require("../models/comments");
const User = require("../models/user");

const create_comment = async (req, res, next) => {
    const { username } = req.user;
    const { post_id } = req.params;
    const { content } = req.body;

    try {

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

const fetch_post_comments = async (req, res, next) => {
    const { post_id } = req.params;

    try {
        // find post
        const post = await Post.findByPk(post_id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const comments = await Comment.findAll({ 
            where: {
                post_id: post_id
            }, 
            include: [
                {
                    model: User,
                    attributes: [ 'username', 'screen_name', 'profile_photo' ]
                }
            ]
        });

        const flattened_comments = comments.map(comment => {
            const { User: userData, ...rest } = comment.toJSON();

            return {
                ...rest,
                ...userData
            }
        })

        res.status(200).json({ comments: [ ...flattened_comments ] });
    } catch (error) {
        console.error('Error fetching comments: ', error);
        res.status(500).json({ message: 'Server Error' });
    }
}

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

module.exports = { create_comment, fetch_comment_count, fetch_post_comments };