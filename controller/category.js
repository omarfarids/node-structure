const User = require("../models/user.schema");
const Category = require("../models/category.schema");

// GET user categories ------------------------
exports.getUserCategory = async (req, res) => {
  const { userId } = req.params;
  const { page = 1, pagination = 10 } = req.query;

  try {
    const user = await User.findById(userId).populate({
      path: "categories",
      options: {
        skip: (page - 1) * pagination,
        limit: parseInt(pagination),
      },
    });
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User categories found successfully",
      data: user.categories,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

// GET user single category ------------------------
exports.getSingleCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        status: 404,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      message: "Category found successfully",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

// POST create user category ------------------------
exports.createUserCategory = async (req, res) => {
  const { userId, name, description } = req.body;
  const image = req.file;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    // Create the category
    const category = new Category({
      name,
      description,
      image: image ? process.env.BASE_URL + image.filename : "",
      createdAt: new Date().toISOString(),
      updatedAt: null,
    });

    // Save the category
    await category.save();

    // Add the category to the user's list of categories
    user.categories.push(category);

    // Save the updated user
    await user.save();

    return res
      .status(201)
      .json({ message: "Category created successfully", data: category });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// PUT update user category ------------------------
exports.updateUserCategory = async (req, res) => {
  const { categoryId, name, description } = req.body;
  const image = req.file;

  try {
    let category;
    if (image && image.filename) {
      category = await Category.findOneAndUpdate(
        { _id: categoryId },
        {
          name,
          description,
          image: process.env.BASE_URL + image.filename,
          updatedAt: new Date().toISOString(),
        },
        { new: true }
      );
    } else {
      category = await Category.findOneAndUpdate(
        { _id: categoryId },
        { name, description, updatedAt: new Date().toISOString() },
        { new: true }
      );
    }

    if (!category) {
      return res.status(404).json({
        status: 404,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Category updated successfully",
      data: {
        id: category._id,
        name: category.name,
        description: category.description,
        image: category.image,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE delete category ------------------------
exports.deleteCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) {
      return res.status(404).json({
        status: 404,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};
