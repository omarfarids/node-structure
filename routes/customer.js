const customerController = require("../controller/customer");

const express = require("express");

const router = express.Router();

/* GET user categories. */
router.get("/category/:userId", customerController.getUserCategory);

/* GET category products. */
router.get("/product/:categoryId", customerController.getCategoryProducts);

/* GET single product. */
router.get(
  "/product/single-product/:productId",
  customerController.getSingleProduct
);

module.exports = router;
