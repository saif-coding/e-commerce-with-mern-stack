const ProductModel = require("../models/productModels");
const uploadCloudinary = require("../middlewares/cloudinary");
const path = require("path");

const addProduct = async (req, res) => {
  try {
    const { title, description, category, productPrice, offerPrice } = req.body;
    const images = await Promise.all(
      req.files.map(async (file) => {
        const result = await uploadCloudinary(file.path);
        return result;
      })
    );
    const product = new ProductModel({
      title,
      description,
      category,
      productPrice,
      offerPrice,
      images: images,
    });
    await product.save();
    res.status(201).json({ message: "Product add successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "failed to add product" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find().sort({ createdAt: -1 }); // Fetch all products
    res.status(200).json(products); // Send them to the frontend
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "product not found by id" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "single product error" });
  }
};

const updateProdcut = async (req, res) => {
  try {
    const { title, description, category, productPrice, offerPrice } = req.body;
    const id = req.params.id;
    const images = await Promise.all(
      req.files.map(async (file) => {
        const result = await uploadCloudinary(file.path);
        return result;
      })
    );
    const update = await ProductModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        category,
        productPrice,
        offerPrice,
        images: images,
      },
      { new: true }
    );
    res.status(201).json({ message: "prodcut updated successfully", update });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error of update post" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteProduct = await ProductModel.findByIdAndDelete(id);
    if (!deleteProduct) {
      return res.status(404).json({ message: "product not found" });
    }
    res
      .status(200)
      .json({ message: "Prodcut deleted successfully", deleteProduct });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error of deleting product" });
  }
};
module.exports = {
  addProduct,
  getAllProducts,
  getSingleProduct,
  updateProdcut,
  deleteProduct,
};
