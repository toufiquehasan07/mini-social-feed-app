const mongose = require('mongoose');
const { Schema } = mongose;

const commentSchema = new mongose.Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
        },
        message: {
            type: String,
            minlength: 2,
            maxlength: 250,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

const Comment = mongose.model('Comment', commentSchema);
module.exports = Comment;
