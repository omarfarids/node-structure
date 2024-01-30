const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
    required: false,
  },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
});

module.exports = mongoose.model("User", userSchema);
