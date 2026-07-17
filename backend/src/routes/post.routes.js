const express = require("express");
const postController = require('../controllers/post.controller');

const router = express.Router();

router.get("/posts", postController.getAll);
router.post("/posts", postController.create);

module.exports = router;