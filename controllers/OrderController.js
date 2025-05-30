const Order = require('../models/orderSchema');
const UserProfile = require('../models/UserProfileClient'); // make sure this path is correct

// Update order status if paymentStatus is 'pending'
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    // Validate allowed order statuses
    if (!['processing', 'shipped', 'delivered'].includes(orderStatus)) {
      return res.status(400).json({ message: 'Invalid order status value' });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.paymentStatus !== 'pending') {
      return res.status(400).json({
        message: `Cannot update orderStatus because paymentStatus is '${order.paymentStatus}'`,
      });
    }

    order.orderStatus = orderStatus;
    await order.save();

    res.json({ message: 'Order status updated successfully', order });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all pending orders and include username + name from user profile
exports.getPendingOrders = async (req, res) => {
  try {
    const pendingOrders = await Order.find({ paymentStatus: 'pending' })
      .populate({
        path: 'userId',
        model: UserProfile, // make sure this matches your user model name
        select: 'username name', // pull BOTH username + name
      });

    res.json({ orders: pendingOrders });
  } catch (err) {
    console.error('Error fetching pending orders:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
