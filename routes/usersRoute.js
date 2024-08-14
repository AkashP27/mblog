const router = require("express").Router();
const usersController = require("../controllers/usersController");
const authController = require("./../controllers/authController");
const cleanCache = require("../utils/cleanCache");
const upload = require("../utils/multer");

router.route("/").get(usersController.getAllUsers);
router.route("/active").get(usersController.getAllActiveUsers);

router
	.route("/:id/posts")
	.get(authController.protect, usersController.getUserPosts);

router
	.route("/:id")
	.get(authController.protect, usersController.getUser)
	.put(
		authController.protect,
		upload.single("avatar"),
		cleanCache,
		usersController.updateUser
	)
	.delete(authController.protect, cleanCache, usersController.deleteUser);

module.exports = router;
