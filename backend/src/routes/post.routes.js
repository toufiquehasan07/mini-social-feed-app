const express = require("express");
const postController = require("../controllers/post.controller");

const router = express.Router();

router.post("/", postController.create);
router.get("/", postController.getAll);
router.post("/:id/like", postController.toogleLike);

module.exports = router;
