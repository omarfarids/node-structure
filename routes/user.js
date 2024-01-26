var express = require("express");
var router = express.Router();
const userController = require("../controller/user");

/* GET all users. */
router.get("/", userController.getAllUsers);

/* GET a user. */
router.get("/:id", userController.getUser);

/* PUT edit user. */
router.put("/:id", userController.editUser);

/* PUT edit user. */
router.put("/:id/update-password", userController.editUserPassword);

/* DELETE delete user. */
router.delete("/:id", userController.deleteUser);

module.exports = router;
