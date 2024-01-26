var express = require("express");
var router = express.Router();
const userController = require("../controller/user");

/* GET all users. */
router.get("/", userController.getAllUsers);

/* GET a user. */
router.get("/:id", userController.getUser);

/* POST edit user. */
router.put("/:id", userController.editUser);

/* DELETE delete user. */
router.delete("/:id", userController.deleteUser);

module.exports = router;
