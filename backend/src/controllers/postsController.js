
const Post = require("../models/post");
const User = require("../models/user");
const PostImage = require("../models/post_images");


/**
 * User creates post
*/
const create_post = async (req, res, next) => {
    const { username } = req.user;
    const { post_text } = req.body;

    try {
        const user = await User.findByPk(username);

        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const post = await Post.create({
            post_text: post_text,
            user: username
        });

        console.log('post created');

        if(req.files && req.files.length > 0) {
            const images = req.files.map(file => {
                const normalizedPath = file.path.replace(/\\/g, '/');
                return {
                    post: post.post_id,
                    post_image_url: normalizedPath,
                    post_id: post.post_id
                };
            });
            
            await PostImage.bulkCreate(images);
        } else {
            console.log('Could not post images: ', req.files)
        }

        return res.status(201).json({ message: "Post created" });

    } catch (error) {
        console.error(`Error creating post: ${error}`);
        res.status(500).json({ message: "Error creating post" });
    }
};

const fetch_posts_by_this_user = async (req, res, next) => {
    const { username } = req.user;

    try {
        const user = await User.findByPk(username);

        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const posts = Post.findAll({ where: { user: username }});

        return res.status(200).json({ data: posts });
    } catch (error) {
        console.error(`Error fetching posts: ${error}`);

        return res.status(500).json({ message: "Error fetching posts" });
    }
};

const fetch_posts_by_other_user = async (req, res, next) => {
    const { username } = req.params;

    try {
        const user = await User.findByPk(username);

        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const posts = Post.findAll({ where: { user: username }});

        return res.status(200).json({ data: posts });
    } catch (error) {
        console.error(`Error fetching posts: ${error}`);

        return res.status(500).json({ message: "Error fetching posts" });
    }
};

module.exports = { create_post, fetch_posts_by_this_user, fetch_posts_by_other_user };