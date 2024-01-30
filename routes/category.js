const express = require("express");
const router = express.Router();
const categoryController = require("../controller/category");

/* GET user categories. */
router.get("/:userId", categoryController.getUserCategory);

/* GET single category */
router.get(
  "/single-category/:categoryId",
  categoryController.getSingleCategory
);

/* POST create user category. */
router.post("/", categoryController.createUserCategory);

/* PUT update user category. */
router.put("/", categoryController.updateUserCategory);

/* DELETE delete user category. */
router.delete("/:categoryId", categoryController.deleteCategory);

module.exports = router;
