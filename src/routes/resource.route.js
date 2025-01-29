const router = require("express").Router();

const resourceController = require("../controllers/resource.controller");
const auth = require("../middlewares/auth.middleware");


router.route("/all").get(resourceController.showResources);
router.route("/byid/:id").get(resourceController.showResource);

router.route("/create").post(auth.verifyJWT, auth.verifyRole("admin"), resourceController.createResource);
router.route("/update/:id").put(auth.verifyJWT,auth.verifyRole("admin"), resourceController.updateResource);
router.route("/delete/:id").delete(auth.verifyJWT,auth.verifyRole("admin"), resourceController.deleteResource);

module.exports = router;
