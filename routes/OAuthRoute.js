const router = require("express").Router();
const OAuthController = require("../controllers/OAuthController");

router.route("/google").get(OAuthController.googleAuth);
router.route("/github").get(OAuthController.githubAuth);
router.route("/linkedIn").get(OAuthController.linkedInAuth);

module.exports = router;
