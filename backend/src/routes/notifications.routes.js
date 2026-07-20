const express = require('express');
const notificationController = require('../controllers/notification.controller');

const router = express.Router();

router.get('/', notificationController.getAllNotifications);
router.put('/fcm-token', notificationController.updateFcmToken);

module.exports = router;
