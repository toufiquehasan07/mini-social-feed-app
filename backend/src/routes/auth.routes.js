const express = require("express");
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post("/signup", authController.signUp);
router.post("/login", authController.login);
router.post("/token/refresh", authController.refreshToken);

module.exports = router;