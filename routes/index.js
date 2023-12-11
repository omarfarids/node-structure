var express = require("express");
var router = express.Router();
const indexController = require("../controller/index");

/* GET home page. */
router.get("/", indexController.indexFunction);

module.exports = router;
