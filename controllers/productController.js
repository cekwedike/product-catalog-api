const Product = require('../models/Product');
const Category = require('../models/Category');

exports.createProduct = async (req, res) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice, lowStock } = req.query;
    const query = {};

    if (name) query.name = new RegExp(name, 'i');
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query['variants.price'] = {};
      if (minPrice) query['variants.price'].$gte = parseFloat(minPrice);
      if (maxPrice) query['variants.price'].$lte = parseFloat(maxPrice);
    }
    if (lowStock) {
      query['variants.inventory'] = { $lt: parseInt(lowStock) };
    }

    const products = await Product.find(query).populate('category');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add these exports
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Add other CRUD operations (getById, update, delete)