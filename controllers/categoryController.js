const Category = require('../models/Category');
const Product = require('../models/Product');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    // First, check if any products are using this category
    const productsUsingCategory = await Product.find({ category: req.params.id });
    
    if (productsUsingCategory.length > 0) {
      return res.status(400).json({
        error: 'Cannot delete category as it is being used by products',
        products: productsUsingCategory.map(p => p.name)
      });
    }

    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    // Update any child categories to remove this category as parent
    await Category.updateMany(
      { parent: req.params.id },
      { $unset: { parent: 1 } }
    );

    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add this method to get all products in a category
exports.getProductsByCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    // Get products directly in this category
    const products = await Product.find({ category: req.params.id })
      .populate('category')
      .populate('variants');

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};