const express = require('express');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = express.Router();

const authRoutes = require('./auth.routes');
const postRoutes = require('./post.routes');
const notificationsRoutes = require('./notifications.routes');

router.use('/auth', authRoutes);
router.use('/posts', verifyToken, postRoutes);
router.use('/notifications', verifyToken, notificationsRoutes);

module.exports = router;
