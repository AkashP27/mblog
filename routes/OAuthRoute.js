const router = require("express").Router();
const OAuthController = require("../controllers/OAuthController");

router.route("/google").get(OAuthController.googleAuth);

module.exports = router;
