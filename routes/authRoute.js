const router = require("express").Router();
const authController = require("../controllers/authController");

router.route("/register").post(authController.registerForm);
router.route("/login").post(authController.loginForm);

module.exports = router;
