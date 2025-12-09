const Post = require("../models/post");
const User = require("../models/user");
const PostImage = require("../models/post_images");

// 1. Import catchAsync and custom errors
const catchAsync = require('../utils/catchAsync'); 
const { NotFoundError } = require('../utils/errorResponse'); // Adjust path as needed


/**
 * User creates post
*/
const create_post = catchAsync(async (req, res, next) => { // Wrapped
    const { username } = req.user;
    const { post_text } = req.body;

    const user = await User.findByPk(username);

    if(!user) {
        throw new NotFoundError("User");
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
});


const delete_post = async (req, res, next) => {
    try {
        const { username } = req.user;
        const { post_id } = req.params;

        const user = await User.findByPk(username);

        if (!user) {
            throw new NotFoundError("User");
        }


        const post = await Post.findOne({ where: { user: username, post_id: post_id }});

        if(!post) {
            throw new NotFoundError("post");
        }

        await post.destroy();

        return res.status(201).json({ message: "Post Deleted" });
    } catch (error) {
        console.error('Error deleting post: ', error);
        return res.status(500).json({message: 'Server Error'});
    }
}

const fetch_posts_by_this_user = catchAsync(async (req, res, next) => { // Wrapped
    const { username } = req.user;

    const user = await User.findByPk(username);

    if (!user) {
        throw new NotFoundError("User");
    }

    const posts = await Post.findAll({
        where: { user: username },
        include: [
            {
                model: User,
                attributes: ['username', 'screen_name', 'profile_photo']
            },
            {
                model: PostImage,
                attributes: [ "id", "post_image_url"]
            }
        ],
        order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({ data: posts });
}); // Removed try...catch


const fetch_posts_by_other_user = catchAsync(async (req, res, next) => { // Wrapped
    const { username } = req.params;

    const user = await User.findByPk(username);

    if (!user) {
        throw new NotFoundError("User");
    }

    const posts = await Post.findAll({
        where: { user: username },
        include: [
            {
                model: User,
                attributes: ['username', 'screen_name', 'profile_photo']
            },
            {
                model: PostImage,
                attributes: [ "id", "post_image_url"]
            }],
        order: [['createdAt', 'DESC']]
    });

    const flattened_posts = posts.map(post => {
        const { User: userData, PostImages, ...rest } = post.toJSON();

        return {
            ...rest,
            ...userData,
            images: PostImages.map(img => img.post_image_url)
        }
    })

    return res.status(200).json({ data: flattened_posts });
}); // Removed try...catch


const fetch_all_posts = catchAsync(async (req, res, next) => { // Wrapped
    const posts = await Post.findAll({
        include: [
            {
                model: User,
                attributes: ['username', 'screen_name', 'profile_photo']
            },
            {
                model: PostImage,
                attributes: [ "id", "post_image_url"]
            }],
        order: [['createdAt', 'DESC']]
    });

    const flattened_posts = posts.map(post => {
        const { User: userData, PostImages, ...rest } = post.toJSON();

        return {
            ...rest,
            ...userData,
            images: PostImages.map(img => img.post_image_url)
        }
    })

    return res.status(200).json({ data: flattened_posts });
}); // Removed try...catch

module.exports = { 
    create_post, 
    fetch_posts_by_this_user, 
    fetch_posts_by_other_user, 
    fetch_all_posts,
    delete_post
 };