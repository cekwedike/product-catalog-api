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

// Add other CRUD operations (getById, update, delete)