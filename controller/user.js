const User = require("../models/user.schema");

// Get all users ---------------------
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("username email _id image");
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
  const id = req.params.id;

  try {
    const user = await User.findById(id);
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
  const { id, username, email } = req.body;
  const image = req.file;

  try {
    let user;
    if (image && image.filename) {
      user = await User.findOneAndUpdate(
        { _id: id },
        {
          username,
          email,
          image: process.env.BASE_URL + "images/" + image.filename,
        },
        { new: true }
      );
    } else {
      user = await User.findOneAndUpdate(
        { _id: id },
        { username, email },
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
  const { id, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({
      status: 400,
      message: "Passwords do not match",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.findOneAndUpdate(
      { _id: id },
      {
        password: hashedPassword,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Password updated successfully",
    });
  } catch (error) {
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
