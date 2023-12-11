// ----------- exports --------------
var createError = require("http-errors");
const mongoose = require("mongoose");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

// ------------- internal exports ------------
var indexRouter = require("./routes/index");

// ------------- app ------------
const port = process.env.PORT || 8000;
var app = express();
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// ----------- routes -----------
app.use("/", indexRouter);

// --------- middlewares ----------
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// ------------- db --------------
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected"))
  .catch((err) => {
    console.log(err);
  });

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
