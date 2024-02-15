const User = require("../models/user.schema");
const bcrypt = require("bcryptjs");
const { passwordRegex } = require("../constants/index");

// Get all users ---------------------
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, pagination = 10 } = req.query;

    const users = await User.find()
      .skip((page - 1) * pagination)
      .limit(pagination);
    return res.status(200).json({
      status: 200,
      message: "Users found successfully",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

// Get user ---------------------
exports.getUser = async (req, res) => {
  const username = req.params.username;

  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }
    return res.status(200).json({
      status: 200,
      message: "User found successfully",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        image: user.image,
        isActive: user.isActive,
        phone: user.phone,
        expiration: user.expiration,
        categories: user.categories,
        isAdmin: user.isAdmin,
        subscriptionDate: user.subscriptionDate,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

// Edit user ---------------------
exports.editUser = async (req, res) => {
  const { id, username, email, phone } = req.body;
  const image = req.file;

  const unifiedUsername = username.toLowerCase().trim().split(" ").join("-");

  try {
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: unifiedUsername }],
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return res.status(400).json({
          status: 400,
          message: "Email already exists",
        });
      } else {
        return res.status(400).json({
          status: 400,
          message: "Username already exists",
        });
      }
    }

    let user;
    if (image && image.filename) {
      user = await User.findOneAndUpdate(
        { _id: id },
        {
          username: unifiedUsername,
          email: email.toLowerCase(),
          image: process.env.BASE_URL + image.filename,
          updatedAt: new Date().toISOString(),
          phone,
        },
        { new: true }
      );
    } else {
      user = await User.findOneAndUpdate(
        { _id: id },
        {
          username: unifiedUsername,
          email: email.toLowerCase(),
          updatedAt: new Date().toISOString(),
          phone,
        },
        { new: true }
      );
    }

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "User updated successfully",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        image: user.image,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

// Edit user password ---------------------
exports.editUserPassword = async (req, res) => {
  const { userId, oldPassword, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({
      status: 400,
      message: "Passwords do not match",
    });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      status: 400,
      message:
        "Password should:be at least 8 characters, contain one uppercase letter,contain one lowercase letter,contain one number and one special character",
    });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    // Compare the old password with the hashed password stored in the database
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        status: 400,
        message: "Old password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate(
      { _id: userId },
      {
        password: hashedPassword,
      },
      { new: true }
    );

    return res.status(200).json({
      status: 200,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

// DELETE delete user ---------------------
exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }
    return res.status(200).json({
      status: 200,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

// POST subscrition user ---------------------
exports.subscription = async (req, res) => {
  const { userId, isActive, expiration } = req.body;

  try {
    // Validate input data
    if (!userId || (isActive == 1 && !expiration)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid request. userId and expiration are required.",
      });
    }

    let update = {
      isActive: isActive == true,
      expiration: isActive == true ? expiration : 0,
      subscriptionDate: isActive == true ? new Date().toISOString() : null,
    };

    const user = await User.findByIdAndUpdate({ _id: userId }, update);

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: 200,
      message:
        isActive == true
          ? "User activated successfully"
          : "User deactivated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};
