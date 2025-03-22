const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  color: { type: String, required: true },
  size: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  inventory: { type: Number, required: true, min: 0 },
  discountPercentage: { type: Number, default: 0, min: 0, max: 100 },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  variants: [variantSchema],
});

module.exports = mongoose.model('Product', productSchema);