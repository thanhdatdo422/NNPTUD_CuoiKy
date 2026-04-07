const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, admin, checkPermission } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').get(getProducts).post(protect, checkPermission('create_product'), createProduct);
router
  .route('/:id')
  .get(getProductById)
  .put(protect, checkPermission('update_product'), updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;