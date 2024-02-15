var express = require("express");
var router = express.Router();
const userController = require("../controller/user");

/* GET all users. */
router.get("/", userController.getAllUsers);

/* GET a user. */
router.get("/:username", userController.getUser);

/* PUT edit password user. */
router.put("/update-password", userController.editUserPassword);

/* PUT edit user. */
router.put("/:id", userController.editUser);

/* DELETE delete user. */
router.delete("/:id", userController.deleteUser);

/* POST subscrition user. */
router.post("/user-activation", userController.subscription);

module.exports = router;
