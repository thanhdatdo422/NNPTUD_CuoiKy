const OrderItem = require('../models/OrderItem');

// @desc    Get all order items
// @route   GET /api/order-items
// @access  Private/Admin
const getOrderItems = async (req, res) => {
  try {
    const orderItems = await OrderItem.find({}).populate('order').populate('product');
    res.json(orderItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single order item
// @route   GET /api/order-items/:id
// @access  Private/Admin
const getOrderItemById = async (req, res) => {
  try {
    const orderItem = await OrderItem.findById(req.params.id).populate('order').populate('product');
    if (orderItem) {
      res.json(orderItem);
    } else {
      res.status(404).json({ message: 'Order item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a order item
// @route   POST /api/order-items
// @access  Private/Admin
const createOrderItem = async (req, res) => {
  const { order, product, quantity, price } = req.body;

  try {
    const orderItem = new OrderItem({
      order,
      product,
      quantity,
      price,
    });

    const createdOrderItem = await orderItem.save();
    res.status(201).json(createdOrderItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a order item
// @route   PUT /api/order-items/:id
// @access  Private/Admin
const updateOrderItem = async (req, res) => {
  try {
    const orderItem = await OrderItem.findById(req.params.id);

    if (orderItem) {
      orderItem.order = req.body.order || orderItem.order;
      orderItem.product = req.body.product || orderItem.product;
      orderItem.quantity = req.body.quantity || orderItem.quantity;
      orderItem.price = req.body.price || orderItem.price;

      const updatedOrderItem = await orderItem.save();
      res.json(updatedOrderItem);
    } else {
      res.status(404).json({ message: 'Order item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a order item
// @route   DELETE /api/order-items/:id
// @access  Private/Admin
const deleteOrderItem = async (req, res) => {
  try {
    const orderItem = await OrderItem.findById(req.params.id);

    if (orderItem) {
      await orderItem.remove();
      res.json({ message: 'Order item removed' });
    } else {
      res.status(404).json({ message: 'Order item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getOrderItems,
  getOrderItemById,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
};