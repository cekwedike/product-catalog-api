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

// Add these routes
router.get('/:id', productController.getProductById);
router.put('/:id',
  [
    body('name').optional().notEmpty(),
    body('description').optional().notEmpty(),
    body('category').optional().isMongoId(),
    body('variants').optional().isArray(),
    body('variants.*.color').optional().notEmpty(),
    body('variants.*.size').optional().notEmpty(),
    body('variants.*.price').optional().isFloat({ min: 0 }),
    body('variants.*.inventory').optional().isInt({ min: 0 }),
  ],
  productController.updateProduct
);
router.delete('/:id', productController.deleteProduct);

module.exports = router;