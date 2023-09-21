const router = require("express").Router();
const OAuthController = require("../controllers/OAuthController");

router.route("/google").get(OAuthController.googleAuth);
router.route("/github").get(OAuthController.githubAuth);

module.exports = router;
