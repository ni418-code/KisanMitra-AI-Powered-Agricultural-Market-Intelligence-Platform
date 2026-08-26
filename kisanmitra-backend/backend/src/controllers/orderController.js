const Order = require('../models/Order');
const Notification = require('../models/Notification');
const { rankMarketsByNetProfit } = require('../utils/profitCalculator');

function buildTimelineStep(status, label, description) {
  return { status, label, description, timestamp: new Date().toISOString(), completed: true, current: false };
}

// POST /api/orders -- created once a farmer accepts a buyer requirement (or vice versa)
async function createOrder(req, res) {
  const {
    requirementId, listingId, cropId, cropName, cropImage, quantity, unit,
    agreedPricePerKg, farmerId, farmerName, farmerVillage, farmerPhone, farmerLocation,
    buyerId, buyerName, buyerPhone, buyerLocation, buyerRating, distanceKm,
  } = req.body;

  if (!farmerId || !buyerId || !quantity || !agreedPricePerKg) {
    return res.status(400).json({ error: 'farmerId, buyerId, quantity and agreedPricePerKg are required.' });
  }

  const totalAmount = quantity * agreedPricePerKg;

  const order = await Order.create({
    requirementId, listingId, cropId, cropName, cropImage, quantity, unit: unit || 'kg',
    agreedPricePerKg, totalAmount,
    farmerId, farmerName, farmerVillage, farmerPhone, farmerLocation,
    buyerId, buyerName, buyerPhone, buyerLocation, buyerRating, distanceKm,
    status: 'posted',
    paymentDetails: {
      status: 'Pending',
      amount: totalAmount,
      breakdown: {
        quantity, unit: unit || 'kg', ratePerKg: agreedPricePerKg,
        totalAmount, platformFee: 0, netPayoutToFarmer: totalAmount,
      },
    },
    timeline: [buildTimelineStep('posted', 'Order Created', 'Order created and awaiting confirmation.')],
  });

  await Notification.create({
    recipientRole: 'farmer', recipientId: farmerId,
    title: 'New order created', message: `Order for ${quantity}${unit || 'kg'} of ${cropName || cropId} was created.`,
    type: 'order', relatedId: order._id.toString(),
  });

  res.status(201).json({ order });
}

async function getOrders(req, res) {
  const { farmerId, buyerId, status } = req.query;
  const query = {};
  if (farmerId) query.farmerId = farmerId;
  if (buyerId) query.buyerId = buyerId;
  if (status) query.status = status;
  const orders = await Order.find(query).sort({ createdAt: -1 });
  res.json({ orders });
}

async function getOrder(req, res) {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found.' });
  res.json({ order });
}

// PUT /api/orders/:id/status -- moves the order through posted -> matched -> accepted -> pickup_scheduled -> crop_picked_up -> payment_completed
async function updateOrderStatus(req, res) {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found.' });

  const { status, label, description } = req.body;
  const allowed = ['posted', 'matched', 'accepted', 'pickup_scheduled', 'crop_picked_up', 'payment_completed'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${allowed.join(', ')}` });
  }

  order.status = status;
  order.timeline.push(buildTimelineStep(status, label || status, description || ''));
  await order.save();

  res.json({ order });
}

// PUT /api/orders/:id/pickup -- transport details
async function updatePickup(req, res) {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found.' });

  order.pickupDetails = { ...order.pickupDetails.toObject?.() ?? order.pickupDetails, ...req.body };
  order.status = 'pickup_scheduled';
  order.timeline.push(buildTimelineStep('pickup_scheduled', 'Pickup Scheduled', 'Transport has been arranged for this order.'));
  await order.save();

  res.json({ order });
}

// POST /api/orders/:id/pay -- SIMULATED payment confirmation for the hackathon/demo build.
// Swap this for a real gateway (Razorpay/UPI) before going live -- see README "Next phases".
async function simulatePayment(req, res) {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found.' });

  const { method = 'UPI (simulated)' } = req.body;
  const platformFeePercent = 0; // adjust if you introduce a real platform fee
  const platformFee = Math.round((order.totalAmount * platformFeePercent) / 100);
  const netPayoutToFarmer = order.totalAmount - platformFee;

  order.paymentDetails = {
    status: 'Payment Completed',
    method,
    amount: order.totalAmount,
    transactionId: `SIM-${Date.now()}`,
    completedAt: new Date().toISOString(),
    breakdown: {
      quantity: order.quantity, unit: order.unit, ratePerKg: order.agreedPricePerKg,
      totalAmount: order.totalAmount, platformFee, netPayoutToFarmer,
    },
  };
  order.status = 'payment_completed';
  order.timeline.push(buildTimelineStep('payment_completed', 'Payment Completed', `Payment of ₹${order.totalAmount} completed via ${method}.`));
  await order.save();

  await Notification.create({
    recipientRole: 'farmer', recipientId: order.farmerId,
    title: 'Payment received', message: `₹${netPayoutToFarmer} has been credited for order ${order._id}.`,
    type: 'payment', relatedId: order._id.toString(),
  });

  res.json({ order });
}

// POST /api/orders/best-market -- the deterministic "where should I sell" calculator
async function bestMarket(req, res) {
  const { quantityKg, options } = req.body;
  if (!quantityKg || !Array.isArray(options) || options.length === 0) {
    return res.status(400).json({ error: 'quantityKg and a non-empty options[] of {marketName, pricePerKg, distanceKm} are required.' });
  }
  const ranked = rankMarketsByNetProfit(quantityKg, options);
  res.json({ ranked, recommendation: ranked[0] });
}

module.exports = { createOrder, getOrders, getOrder, updateOrderStatus, updatePickup, simulatePayment, bestMarket };
