const Post = require('../models/Post');
const Like = require('../models/Like');
const Comment = require('../models/Comment');
const { parsePosts } = require('../utils/parser.js');

exports.getAll = async (req, res) => {
    try {
        const userId = req.user.id;
        // console.log('info user id: ', userId);

        const posts = await Post.find()
            .populate('author', 'name username email')
            .sort({ createdAt: -1 });

        // console.log('db fatched posts: ', posts);

        const postIds = posts.map((post) => post._id);
        // console.log('postIds: ', postIds);
        const likes = await Like.find({
            post: { $in: postIds },
        });

        const comments = await Comment.find({
            post: { $in: postIds },
        }).populate('user', 'name username email');

        const data = parsePosts(posts, likes, comments, userId); // parse and prepare responseable post

        return res.status(200).json({
            success: true,
            message: 'Posts fetched successfully',
            data,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch posts',
        });
    }
};

exports.create = async (req, res) => {
    const { content } = req.body;
    const user = req.user;
    // console.log("info content and user: ", content, user);

    if (!content || !content.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Post content is required',
        });
    }

    const newPost = await Post.create({
        author: user.id,
        content,
    });

    return res.status(200).json({
        success: true,
        message: 'Post created successfully',
        data: {
            post: newPost,
        },
    });
};

exports.toogleLike = async (req, res) => {
    const user = req.user;
    const userId = user?.id;
    const { id: postId } = req.params;
    // console.log("info postid: ", req.params, postId);

    if (!postId || !userId) {
        return res.status(400).json({
            success: false,
            message: 'Missing postId or user.',
        });
    }

    try {
        const postExists = await Post.exists({ _id: postId });
        if (!postExists) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        const alreadyLiked = await Like.exists({
            user: userId,
            post: postId,
        });

        if (alreadyLiked) {
            await Like.deleteOne({
                user: userId,
                post: postId,
            });

            return res.status(200).json({
                success: true,
                message: 'Post unliked successfully',
                data: {
                    liked: false,
                },
            });
        }

        await Like.create({
            user: userId,
            post: postId,
        });

        return res.status(200).json({
            success: true,
            message: 'Post liked successfully',
            data: {
                liked: true,
            },
        });
    } catch (err) {
        console.error('Error in like or unlike:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to toogle like.',
        });
    }
};

exports.createComment = async (req, res) => {
    const userId = req.user?.id;
    const { id: postId } = req.params;
    const { message } = req.body;

    // console.log('info post id params: ', postId, req.params);

    const trimedMessage = message?.trim();

    if (!userId || !postId || !trimedMessage) {
        return res.status(400).json({
            success: false,
            message: 'Missing required params',
        });
    }

    try {
        const newComment = await Comment.create({
            user: userId,
            post: postId,
            message: trimedMessage,
        });
        return res.status(200).json({
            success: true,
            message: 'Comment created successfully',
            data: newComment,
        });
    } catch (err) {
        console.error('Error in creating comment', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to create comment',
        });
    }
};
