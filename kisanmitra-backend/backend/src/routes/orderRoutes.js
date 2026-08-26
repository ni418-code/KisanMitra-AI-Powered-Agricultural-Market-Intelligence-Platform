const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { createOrder, getOrders, getOrder, updateOrderStatus, updatePickup, simulatePayment, bestMarket } = require('../controllers/orderController');

router.get('/', requireAuth, getOrders);
router.get('/:id', requireAuth, getOrder);
router.post('/', requireAuth, createOrder);
router.put('/:id/status', requireAuth, updateOrderStatus);
router.put('/:id/pickup', requireAuth, updatePickup);
router.post('/:id/pay', requireAuth, simulatePayment);
router.post('/best-market', requireAuth, bestMarket);

module.exports = router;
