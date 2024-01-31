const express = require("express");
const router = express.Router();
const productController = require("../controller/product");

/* GET category products */
router.get("/:categoryId", productController.getCategoryProducts);

/* GET single product */
router.get("/single-product/:productId", productController.getSingleProduct);

/* POST create category product. */
router.post("/", productController.createCategoryProduct);

/* PUT update category product.. */
router.put("/", productController.updateCategoryProduct);

/* DELETE delete category product.. */
router.delete("/:productId", productController.deleteProduct);

module.exports = router;
