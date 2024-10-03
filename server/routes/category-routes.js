const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category-controller');

// CRUD routes for categories
router.post('/', categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.get('/By/:id', categoryController.getCategoryById);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;