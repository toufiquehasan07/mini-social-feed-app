const Notification = require('../models/Notification');
const User = require('../models/User');

exports.getAllNotifications = async (req, res) => {
    const userId = req.user?.id;
    // console.log("info user id: ", userId);

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: 'User not found',
        });
    }

    try {
        const notifications = await Notification.find({
            to: userId,
        })
            .populate('from', 'username name email')
            .populate('to', 'username name email')
            .sort({ createdAt: -1 });

        // console.log('info notifications: ', notifications);

        return res.status(200).json({
            success: true,
            message: 'Notification list fetched successfully',
            data: notifications,
        });
    } catch (err) {
        console.error('Error in getting user notification', err);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve user notifications',
        });
    }
};

exports.updateFcmToken = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { token } = req.body;

        if (!userId || !token) {
            return res.status(400).json({
                success: false,
                message: 'User ID and FCM token are required',
            });
        }

        const user = await User.findOne({
            _id: userId,
        });

        if (token && user.fcmToken !== token) {
            user.fcmToken = token;
            await user.save();
        }

        return res.status(200).json({
            success: true,
            message: 'FCM token updated successfully',
        });
    } catch (err) {
        console.error('Error in updating FCM token: ', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to update FCM token',
        });
    }
};
