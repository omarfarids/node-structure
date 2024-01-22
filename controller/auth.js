const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/functions");
const { sign } = require("jsonwebtoken");

// -------------------- login --------------------
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(400).json({
      status: 400,
      message: "Invalid credentials",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({
      status: 400,
      message: "Invalid credentials",
    });
  }

  const token = generateToken(user.username);

  return res.status(200).json({
    status: 200,
    message: "Logged in successfully",
    data: {
      username: user.username,
      email: user.email,
      id: user._id,
      role: user.isAdmin ? "admin" : "user",
      image: user.image,
      token,
    },
  });
};

// -------------------- signup --------------------
exports.signup = async (req, res) => {
  const { email, username, password, confirmPassword } = req.body;
  const image = req.file;

  console.log(image);

  // Checking if the passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({
      status: 400,
      message: "Passwords do not match",
    });
  }

  try {
    // Checking if the email already exists
    const isUserExists = await User.findOne({ email: email });
    if (isUserExists) {
      return res.status(400).json({
        status: 400,
        message: "Email already exists",
      });
    }

    // Creating a new user
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      image: image ? process.env.BASE_URL + "images/" + image.filename : "",
    });

    // Saving the user
    await newUser.save();

    return res.status(200).json({
      status: 200,
      message: "User signed up successfully",
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Something went wrong",
    });
  }
};
