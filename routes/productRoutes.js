// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createProduct,
} = require('../controllers/productController');
const upload = require('../middleware/upload');

// Routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id',upload.array('productImages', 10), updateProduct);
router.delete('/:id', deleteProduct);
router.post('/', upload.array('productImages', 10), createProduct); // ✅ Correct way

module.exports = router;
