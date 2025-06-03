const express = require('express');
const router = express.Router();
const orderController = require('../controllers/OrderController.js');

router.patch('/:orderId/status', orderController.updateOrderStatus);
router.get('/pending', orderController.getPendingOrders);
router.delete('/:orderId', orderController.deleteOrder);

module.exports = router;
