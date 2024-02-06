const User = require("../models/user.schema");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/functions");
const nodemailer = require("nodemailer");

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
      createdAt: new Date().toISOString(),
      updatedAt: null,
      image: image ? process.env.BASE_URL + image.filename : "",
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

// POST reset password user ---------------------
exports.resetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    const newPassword = Math.random().toString(36).slice(-8);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate(
      { email: email },
      {
        password: hashedPassword,
        updatedAt: new Date().toISOString(),
      },
      { new: true }
    );
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: 587,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset",
      text: `Your new password is: ${newPassword}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
        return res.status(500).json({ message: "Failed to send email" });
      } else {
        console.log("Email sent:", info.response);
        return res.status(200).json({ message: "Password reset successful" });
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};
