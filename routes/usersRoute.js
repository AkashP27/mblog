const router = require("express").Router();
const usersController = require("../controllers/usersController");

router
 .route("/:id")
 .get(usersController.getUser)
 .put(usersController.updateUser)
 .delete(usersController.deleteUser);

module.exports = router;
