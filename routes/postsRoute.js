const router = require("express").Router();
const postsController = require("../controllers/postsController");
const cors = require("cors");

router.use(cors());

router.route("/").post(postsController.postForm);
router.route("/").get(postsController.getForm);
router
 .route(":id")
 .get(postsController.getForm)
 .put(postsController.updateForm)
 .delete(postsController.deleteForm);

module.exports = router;
