const router = require("express").Router();
const authController = require("../controllers/authController");
const rateLimit = require("../utils/rateLimit");

router.route("/register").post(authController.registerUser);
router
	.route("/login")
	.post(
		rateLimit({ secondsWindow: 10 * 60, allowedHits: 30 }),
		authController.loginUser
	);

router.route("/forgot-password").post(authController.forgotPassword);
router.route("/reset-password/:token").put(authController.resetPassword);

router
	.route("/update-password")
	.put(authController.protect, authController.updatePassword);

module.exports = router;
