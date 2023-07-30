const router = require("express").Router();
const postsController = require("../controllers/postsController");
const cors = require("cors");

router.use(cors());

router
	.route("/")
	.get(postsController.getAllPost)
	.post(postsController.createPost);

router
	.route("/:id")
	.get(postsController.getSinglePost)
	.put(authController.protect, postsController.updatePost)
	.delete(authController.protect, postsController.deletePost);

module.exports = router;
