const Notification = require('../models/Notification');

exports.createNotification = async (fromId, postId, type, toId) => {
    if (!fromId || !postId || !type || !toId) {
        return null;
    }

    // console.log('info from and to id: ', fromId, toId);
    if (fromId === toId.toString()) return null;

    try {
        const newNotification = await Notification.create({
            from: fromId,
            to: toId,
            post: postId,
            type,
        });
        return newNotification;
    } catch (err) {
        console.error('Error creating notification:', err);
        return null;
    }
};
