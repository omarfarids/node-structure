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
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    required: true,
  },
  expiration: {
    type: Number,
    default: 0,
  },
  subscriptionDate: {
    type: Date || null,
  },
  headerImage: {
    type: String,
    required: false,
  },
  backgroundImage: {
    type: String,
    required: false,
  },
  themeColor: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date || null,
  },
  image: {
    type: String,
    required: false,
  },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
});

module.exports = mongoose.model("User", userSchema);
