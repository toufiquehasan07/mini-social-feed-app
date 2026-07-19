const Notification = require('../models/Notification');

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
