const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const {
  createOrder, getOrders, getOrder, updateOrderStatus, updatePickup, simulatePayment, bestMarket,
} = require('../controllers/orderController');

router.get('/', getOrders);
router.get('/:id', getOrder);
router.post('/', requireAuth, createOrder);
router.put('/:id/status', requireAuth, updateOrderStatus);
router.put('/:id/pickup', requireAuth, updatePickup);
router.post('/:id/pay', requireAuth, simulatePayment);
router.post('/best-market', bestMarket);

module.exports = router;
