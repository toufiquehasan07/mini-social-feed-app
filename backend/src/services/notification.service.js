const Notification = require('../models/Notification');

exports.createNotification = async (fromId, postId, type, toId) => {
    if (!fromId || !postId || !type || !toId) {
        return null;
    }

    if (fromId === toId) return null;

    try {
        const newNotification = await Notification.create({
            from: fromId,
            to: toId,
            post: postId,
            type,
        });
        // console.log('info new notification: ', newNotification);
        return newNotification;
    } catch (err) {
        console.error('Error creating notification:', err);
        return null;
    }
};
