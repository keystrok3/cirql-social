const Post = require("../models/post");
const Repost = require("../models/repost");


const make_repost = async (req, res, next) => {
    try {
        const { post_id } = req.params;
        const { username } = req.user;

        // find post
        const post = await Post.findByPk(post_id);

        if(!post) {
            return res.status(404).json({ message: "Post doesn't exist" });
        }

        // create repost
        await Repost.create({
            post: post_id,
            user: username
        });

        return res.status(201).json({ message: "Reposted" });
    } catch (error) {
        console.error('Error reposting: ', error);
        res.status(500).json({ message: "Unexpected Error Reposting"})
    }
};


const undo_repost = async (req, res, next) => {
    try {
        const { post_id } = req.params;
        const { username } = req.user;

        // find repost
        const repost = await Repost.findOne({
            where: { post: post_id, user: username }
        });

        if (!repost) {
            return res.status(404).json({ message: "Repost not found" });
        }

        // delete repost
        await repost.destroy();

        return res.status(200).json({ message: "Repost undone" });
    } catch (error) {
        console.error("Error undoing repost:", error);
        res.status(500).json({ message: "Unexpected Error Undoing Repost" });
    }
};



const check_user_repost = async (req, res, next) => {
    try {
        const { post_id } = req.params;
        const { username } = req.user;

        // find post
        const post = await Post.findByPk(post_id);

        if(!post) {
            return res.status(404).json({ message: "Post doesn't exist" });
        }

        const has_reposted = await Repost.findOne({ where: { user: username, post: post_id }});

        return res.status(200).json({ reposted: !!has_reposted });
    } catch (error) {
        console.error('Error reposting: ', error);
        res.status(500).json({ message: "Unexpected Error Reposting" });
    }
};

const get_repost_count = async (req, res, next) => {
    try {
        const { post_id } = req.params;

        const post = await Post.findByPk(post_id);
        if (!post) {
            return res.status(404).json({ message: "Post doesn't exist" });
        }

        const count = await Repost.count({ where: { post: post_id } });

        return res.status(200).json({ repost_count: count });
    } catch (error) {
        console.error("Error getting repost count:", error);
        res.status(500).json({ message: "Unexpected Error Getting Repost Count" });
    }
};


module.exports = { make_repost, undo_repost, check_user_repost, get_repost_count };