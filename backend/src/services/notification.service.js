const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendNotification } = require('../services/firebase.service');

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
        const toUser = await User.findOne({ _id: toId });
        const fromUser = await User.findOne({ _id: fromId });

        if (toUser && toUser.fcmToken) {
            sendNotification(toUser.fcmToken, {
                title: 'Greetings',
                body: `${fromUser.name} ${type} your post`,
            });
        }
        return newNotification;
    } catch (err) {
        console.error('Error creating notification:', err);
        return null;
    }
};
