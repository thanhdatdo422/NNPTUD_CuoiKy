const express = require('express');
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, checkPermission } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').get(getCategories).post(protect, checkPermission('create_category'), createCategory);
router
  .route('/:id')
  .get(getCategoryById)
  .put(protect, checkPermission('update_category'), updateCategory)
  .delete(protect, checkPermission('delete_category'), deleteCategory);

module.exports = router;