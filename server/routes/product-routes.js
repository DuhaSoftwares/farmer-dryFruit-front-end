const express = require('express');
const router = express.Router();
const productController = require('../controllers/product-controller'); // Ensure correct path

// Route for getting all products
router.get('/', productController.getAllProducts);

// Route for getting products by category
router.get('/category/:categoryId', productController.getProductsByCategory);

// Route for creating a new product (no multer needed)
router.post('/', productController.createProduct);

// Route for updating a product
router.put('/:id', productController.updateProduct);

// Route for deleting a product
router.delete('/:id', productController.deleteProduct);

module.exports = router;
