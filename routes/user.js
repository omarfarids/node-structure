var express = require("express");
var router = express.Router();
const userController = require("../controller/user");

/* GET all users. */
router.get("/", userController.getAllUsers);

/* GET a user. */
router.get("/:username", userController.getUser);

/* PUT edit user. */
router.put("/:id", userController.editUser);

/* PUT edit user. */
router.put("/:id/update-password", userController.editUserPassword);

/* DELETE delete user. */
router.delete("/:id", userController.deleteUser);

/* POST subscrition user. */
router.post("/user-activation", userController.subscription);

module.exports = router;
