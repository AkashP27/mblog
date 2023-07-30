const router = require("express").Router();
const authController = require("../controllers/authController");

router.route("/register").post(authController.registerUser);
router.route("/login").post(authController.loginUser);

router.route("/forgot-password").post(authController.forgotPassword);
router.route("/reset-password/:token").put(authController.resetPassword);

module.exports = router;
