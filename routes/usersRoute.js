const router = require("express").Router();
const usersController = require("../controllers/usersController");
const authController = require("./../controllers/authController");

router
	.route("/:id")
	.get(authController.protect, usersController.getUser)
	.put(authController.protect, usersController.updateUser)
	.delete(authController.protect, usersController.deleteUser);

module.exports = router;
