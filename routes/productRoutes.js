const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/',
  [
    body('name').notEmpty(),
    body('description').notEmpty(),
    body('category').isMongoId(),
    body('variants').isArray({ min: 1 }),
    body('variants.*.color').notEmpty(),
    body('variants.*.size').notEmpty(),
    body('variants.*.price').isFloat({ min: 0 }),
    body('variants.*.inventory').isInt({ min: 0 }),
  ],
  productController.createProduct
);

router.get('/', productController.getProducts);

// Add other routes (GET/:id, PUT, DELETE)

module.exports = router;