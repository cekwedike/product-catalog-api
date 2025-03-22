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