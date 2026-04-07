const express = require('express');
const {
  getReviews,
  getReviewsByProduct,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').get(getReviews).post(protect, createReview);
router.route('/product/:productId').get(getReviewsByProduct);
router
  .route('/:id')
  .get(getReviewById)
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;