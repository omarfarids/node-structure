const Category = require("../models/category.schema");
const Product = require("../models/product.schema");

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

// POST create category product ------------------------
exports.createCategoryProduct = async (req, res) => {
  const { categoryId, name, description, price } = req.body;
  const image = req.file;

  try {
    // Find the category by ID
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        status: 404,
        message: "Category not found",
      });
    }

    // Create the product
    const product = new Product({
      name,
      description,
      price,
      image: image ? process.env.BASE_URL + image.filename : "",
      createdAt: new Date().toISOString(),
      updatedAt: null,
    });

    // Save the product
    await product.save();

    // Add the product to the category's list of products
    category.products.push(product);

    // Save the updated category
    await category.save();

    return res
      .status(201)
      .json({ message: "Product created successfully", data: product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// PUT update category product. ------------------------
exports.updateCategoryProduct = async (req, res) => {
  const { productId, name, description, price } = req.body;
  const image = req.file;

  try {
    let product;
    if (image && image.filename) {
      product = await Product.findOneAndUpdate(
        { _id: productId },
        {
          name,
          description,
          price,
          image: process.env.BASE_URL + image.filename,
          updatedAt: new Date().toISOString(),
        },
        { new: true }
      );
    } else {
      product = await Product.findOneAndUpdate(
        { _id: productId },
        { name, description, price, updatedAt: new Date().toISOString() },
        { new: true }
      );
    }

    if (!product) {
      return res.status(404).json({
        status: 404,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Product updated successfully",
      data: {
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE delete product ------------------------
exports.deleteProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return res.status(404).json({
        status: 404,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};
