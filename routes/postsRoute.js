const router = require("express").Router();
const authController = require("./../controllers/authController");
const postsController = require("../controllers/postsController");
const upload = require("../utils/multer");

router
	.route("/")
	.get(postsController.getAllPost)
	.post(upload.single("image"), postsController.createPost);

router
	.route("/:id")
	.get(postsController.getSinglePost)
	.put(authController.protect, postsController.updatePost)
	.delete(authController.protect, postsController.deletePost);

module.exports = router;
