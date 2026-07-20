const Post = require('../models/Post');
const Like = require('../models/Like');
const Comment = require('../models/Comment');
const { parsePosts } = require('../utils/parser.js');
const { createNotification } = require('../services/notification.service.js');

const NOTIFICATION_TYPE = {
    liked: 'liked',
    disliked: 'disliked',
    commented: 'commented',
};

exports.getAll = async (req, res) => {
    try {
        const userId = req.user.id;
        // console.log('info user id: ', userId);

        const posts = await Post.find()
            .populate('author', 'name username email')
            .sort({ createdAt: -1 });

        // console.log('db fetched posts: ', posts);

        const postIds = posts.map((post) => post._id);
        // console.log('postIds: ', postIds);
        const likes = await Like.find({
            post: { $in: postIds },
        });

        const comments = await Comment.find({
            post: { $in: postIds },
        }).populate('user', 'name username email');

        const data = parsePosts(posts, likes, comments, userId); // parse and prepare responsible post

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

    try {
        const newPost = await Post.create({
            author: user.id,
            content,
        });

        return res.status(200).json({
            success: true,
            message: 'Post created successfully',
            data: newPost,
        });
    } catch (err) {
        console.error('error in creating post: ', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to create post',
        });
    }
};

exports.toggleLike = async (req, res) => {
    const userId = req.user?.id;
    // console.log('info userId: ', userId);
    const { id: postId } = req.params;
    // console.log('info userId: ', postId);

    if (!postId || !userId) {
        return res.status(400).json({
            success: false,
            message: 'Missing postId or user.',
        });
    }

    try {
        const post = await Post.findById(postId).populate(
            'author',
            'name username email',
        );

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        const alreadyLiked = await Like.exists({
            user: userId,
            post: postId,
        });

        let liked = false;

        if (alreadyLiked) {
            await Like.deleteOne({
                user: userId,
                post: postId,
            });

            liked = false;

            await createNotification(
                userId,
                postId,
                NOTIFICATION_TYPE.disliked,
                post.author._id,
            );
        } else {
            await Like.create({
                user: userId,
                post: postId,
            });

            liked = true;

            await createNotification(
                userId,
                postId,
                NOTIFICATION_TYPE.liked,
                post.author._id,
            );
        }

        const likes = await Like.countDocuments({
            post: postId,
        });

        return res.status(200).json({
            success: true,
            message: liked
                ? 'Post liked successfully'
                : 'Post disliked successfully',
            data: {
                postId,
                liked,
                likes,
            },
        });
    } catch (err) {
        console.error('Error in like or unlike:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to toggle like.',
        });
    }
};

exports.createComment = async (req, res) => {
    const userId = req.user?.id;
    const { id: postId } = req.params;
    const { message } = req.body;

    // console.log('info post id params: ', postId, req.params);

    const trimmedMessage = message?.trim();

    if (!userId || !postId || !trimmedMessage) {
        return res.status(400).json({
            success: false,
            message: 'Missing required params',
        });
    }

    try {
        const post = await Post.findOne({ _id: postId }).populate(
            'author',
            'name username email',
        );

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        const newComment = await Comment.create({
            user: userId,
            post: postId,
            message: trimmedMessage,
        });

        // fromId, postId, type, toId
        await createNotification(
            userId,
            postId,
            NOTIFICATION_TYPE.commented,
            post.author._id,
        );

        const commentDetails = await Comment.findOne({
            _id: newComment._id,
        }).populate('user', 'name email username');

        console.log('info comment details: ', commentDetails);

        return res.status(200).json({
            success: true,
            message: 'Comment created successfully',
            data: commentDetails,
        });
    } catch (err) {
        console.error('Error in creating comment', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to create comment',
        });
    }
};
