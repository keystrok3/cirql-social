const Post = require("../models/post");
const Comment = require("../models/comments");
const User = require("../models/user");

// 1. Import catchAsync and custom errors
const catchAsync = require('../utils/catchAsync'); 
const { NotFoundError } = require('../utils/errorResponse'); // Adjust path as needed
const notificationEvents = require("../events/notificationEvent");


const create_comment = catchAsync(async (req, res, next) => { // Wrapped
    const { username } = req.user;
    const { post_id } = req.params;
    const { content } = req.body;

    // find post
    const post = await Post.findByPk(post_id);
    if (!post) throw new NotFoundError("Post");

    // create post
    const comment = await Comment.create({
        user: username,
        post_id: post_id,
        content: content
    });


    if(post.user !== comment.user) {
        console.log('event triggered')
        notificationEvents.emit("notification.created", {
            receiver: post.user,
            actor: username,
            notification_type: "Comment",
            source_id: comment.comment_id,
            sourceType: "Comment"
        })
    }

    return res.status(201).json({ message: "Comment created" });
});


const fetch_post_comments = catchAsync(async (req, res, next) => { // Wrapped
    const { post_id } = req.params;

    // find post
    const post = await Post.findByPk(post_id);
    if (!post) throw new NotFoundError("Post");

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
}); // Removed try...catch

const fetch_comment_count = catchAsync(async (req, res, next) => { // Wrapped
    const { post_id } = req.params;

    // find post
    const post = await Post.findByPk(post_id);
    if (!post) throw new NotFoundError("Post");

    // fetch comment count
    const comment_count = await Comment.count({ where: { post_id: post_id }});
    
    return res.status(200).json({ post_id, comments: comment_count });
}); // Removed try...catch

module.exports = { create_comment, fetch_comment_count, fetch_post_comments };