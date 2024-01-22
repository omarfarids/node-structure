var express = require("express");
var router = express.Router();
const authController = require("../controller/auth");

/* POST login. */
router.post("/login", authController.login);

/* POST signup. */
router.post("/signup", authController.signup);

module.exports = router;
