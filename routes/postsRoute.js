const router = require("express").Router();
const authController = require("./../controllers/authController");
const postsController = require("../controllers/postsController");
const upload = require("../utils/multer");
const cleanCache = require("../utils/cleanCache");

router
	.route("/")
	.get(postsController.getAllPost)
	.post(
		authController.protect,
		upload.single("image"),
		cleanCache,
		postsController.createPost
	);

router.route("/author/:authorId").get(postsController.getPostsByAuthor);

router.route("/random").get(postsController.getRandomPosts);

router
	.route("/:id")
	.get(postsController.getSinglePost)
	.put(authController.protect, cleanCache, postsController.updatePost)
	.delete(authController.protect, cleanCache, postsController.deletePost);

module.exports = router;
