const jwt = require("jsonwebtoken");

const multer = require("multer");

const secretKey = process.env.SECRET_KEY || "secret";

// ----------- token generator ------------
const generateToken = (userId) => {
  const token = jwt.sign({ userId }, secretKey, { expiresIn: "1h" });

  return token;
};

// ----------- file storage ------------
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

// ----------- file storage ------------
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

module.exports = { generateToken, fileStorage, fileFilter };
