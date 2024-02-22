const User = require("../models/user.schema");
const Category = require("../models/category.schema");
const Product = require("../models/product.schema");

// GET user categories ------------------------
exports.getUserCategory = async (req, res) => {
  const { username } = req.params;
  const { page = 1, pagination = 10 } = req.query;

  try {
    const user = await User.findOne({ username: username }).populate({
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
      user: {
        username: user.username,
        email: user.email,
        id: user._id,
        phone: user.phone,
        image: user.image,
        headerImage: user.headerImage,
        backgroundImage: user.backgroundImage,
        themeColor: user.themeColor,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

// GET categories products ------------------------
exports.getCategoryProducts = async (req, res) => {
  const { categoryId } = req.params;
  const { page = 1, pagination = 10 } = req.query;

  try {
    const category = await Category.findById(categoryId).populate({
      path: "products",
      options: {
        skip: (page - 1) * pagination,
        limit: parseInt(pagination),
      },
    });
    if (!category) {
      return res.status(404).json({
        status: 404,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      message: "Category products found successfully",
      data: category.products,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

// GET user single product ------------------------
exports.getSingleProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: 404,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product found successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};
