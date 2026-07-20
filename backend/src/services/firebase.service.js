const fcm = require('../config/firebase');

exports.sendNotification = async ({ token, title, body, data = {} }) => {
    if (!token || !title || !body) {
        return null;
    }
    try {
        return await fcm.send({
            token,
            notification: {
                title,
                body,
            },
            data,
        });
    } catch (err) {
        console.error('Failed to send FCM notification:', err);
        return null;
    }
};
