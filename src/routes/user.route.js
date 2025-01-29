const router = require("express").Router();

const userController = require("../controllers/user.controller");
const auth = require("../middlewares/auth.middleware");


router.route("/register").post(userController.register);
router.route("/login").post(userController.login);
router.route("/logout").post(auth.verifyJWT, userController.logout);

module.exports = router;