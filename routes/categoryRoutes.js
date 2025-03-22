const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Category = require('../models/Category');

router.post('/',
  [
    body('name').notEmpty(),
    body('parent').optional().isMongoId(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const category = new Category(req.body);
      await category.save();
      res.status(201).json(category);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().populate('parent');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('parent');
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id',
  [
    body('name').optional().notEmpty(),
    body('parent').optional().isMongoId(),
  ],
  async (req, res) => {
    try {
      const category = await Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!category) return res.status(404).json({ error: 'Category not found' });
      res.json(category);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;