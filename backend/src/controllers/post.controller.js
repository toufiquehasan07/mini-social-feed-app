const Post = require("../models/Post");

exports.getAll = async (req, res) => {
  const posts = await Post.find()
    .populate("author", "username email name")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    message: "Post fetched successfully",
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
      message: "Post content is required",
    });
  }

  const newPost = await Post.create({
    author: user.id,
    content,
  });

  return res.status(200).json({
    success: true,
    message: "Post created successfully",
    data: {
      post: newPost,
    },
  });
};
