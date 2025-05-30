const express = require('express');
const router = express.Router();
const orderController = require('../controllers/OrderController.js');

router.patch('/:orderId/status', orderController.updateOrderStatus);
router.get('/pending', orderController.getPendingOrders);

module.exports = router;
