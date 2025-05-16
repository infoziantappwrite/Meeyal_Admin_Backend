const express = require('express');
const router = express.Router();
const subCategoryController = require('../controllers/subCategoryController');

router.post('/', subCategoryController.createSubCategory);
router.get('/', subCategoryController.getAllSubCategories);
router.get('/:id', subCategoryController.getSubcategoriesByCategory);
router.delete('/:id', subCategoryController.deleteSubCategory);

module.exports = router;
