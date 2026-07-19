exports.parsePosts = (posts, likes, comments, userId) => {
    return posts.map((post) => {
        const postId = post._id.toString();

        const filteredLikes = likes.filter(
            (like) => like.post.toString() === postId,
        );

        const filteredComments = comments.filter(
            (comment) => comment.post.toString() === postId,
        );

        const liked = filteredLikes.find(
            (like) => like.user.toString() === userId,
        );

        const commented = filteredComments.find(
            (comment) => comment.user.toString() === userId,
        );

        return {
            ...post.toObject(),
            likes: filteredLikes.length,
            liked: !!liked,
            commented: !!commented,
            comments: filteredComments,
        };
    });
};
