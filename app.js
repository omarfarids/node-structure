// ----------- exports --------------
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");

// ------------- internal exports ------------
var indexRouter = require("./routes/index");
var authRouter = require("./routes/auth");
var userRouter = require("./routes/user");
var authenticateToken = require("./middlewares/authenticateToken");
var { fileStorage, fileFilter } = require("./utils/functions");

// ------------- app ------------
const port = process.env.PORT || 8000;
var app = express();
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// ----------- database -----------
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected"))
  .catch((err) => {
    console.log(err);
  });

// --------- middlewares ----------
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(express.static(path.join(__dirname, "public")));

// ----------- routes -----------
app.use("/auth", authRouter);

app.use(authenticateToken); //is user authenticated
app.use("/", indexRouter);
app.use("/user", userRouter);

// ------- catch 404 and forward to error handler ------
app.use(function (req, res, next) {
  next(createError(404));
});

// ------------ error handler -------------
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500).send({
    status: err.status || 500,
    message: err.message,
  });
});
