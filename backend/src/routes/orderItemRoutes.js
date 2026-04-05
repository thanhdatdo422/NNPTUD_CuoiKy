const express = require('express');
const {
  getOrderItems,
  getOrderItemById,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
} = require('../controllers/orderItemController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').get(protect, admin, getOrderItems).post(protect, admin, createOrderItem);
router
  .route('/:id')
  .get(protect, admin, getOrderItemById)
  .put(protect, admin, updateOrderItem)
  .delete(protect, admin, deleteOrderItem);

module.exports = router;