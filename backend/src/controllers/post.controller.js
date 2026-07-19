const Post = require('../models/Post');
const Like = require('../models/Like');

exports.getAll = async (req, res) => {
    const posts = await Post.find()
        .populate('author', 'username email name')
        .sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        message: 'Post fetched successfully',
        data: {
            posts,
        },
    });
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
            message: 'Failed to update like.',
        });
    }
};
