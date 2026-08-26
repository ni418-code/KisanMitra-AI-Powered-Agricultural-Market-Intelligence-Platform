const BuyerRequirement = require('../models/BuyerRequirement');
const FarmerListing = require('../models/FarmerListing');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Order = require('../models/Order');

const toKg = (quantity, unit) => unit === 'quintal' ? quantity * 100 : quantity;

function distanceKm(lat1, lon1, lat2, lon2) {
  if ([lat1, lon1, lat2, lon2].some(v => typeof v !== 'number')) return null;
  const rad = Math.PI / 180;
  const a = 0.5 - Math.cos((lat2 - lat1) * rad) / 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * (1 - Math.cos((lon2 - lon1) * rad)) / 2;
  return 12742 * Math.asin(Math.sqrt(a));
}

async function createRequirement(req, res) {
  const buyer = await User.findById(req.userId);
  if (!buyer || buyer.role !== 'buyer') return res.status(403).json({ error: 'Only buyer accounts can post requirements.' });
  const { cropId, cropName, cropImage, quantity, unit = 'kg', offerPrice, requiredDate, pickupRadiusKm = 25, latitude, longitude, notes } = req.body;
  if (!cropId || !quantity || quantity <= 0 || !offerPrice || offerPrice <= 0) return res.status(400).json({ error: 'cropId, positive quantity and positive offerPrice are required.' });

  const requirement = await BuyerRequirement.create({
    buyerId: buyer._id, buyerName: buyer.name, buyerLocation: buyer.location, buyerPhone: buyer.phone,
    buyerRating: buyer.rating, verifiedPurchases: buyer.completedOrdersCount, cropId, cropName, cropImage,
    quantity, unit, offerPrice, totalEstimatedValue: toKg(quantity, unit) * offerPrice, requiredDate,
    pickupRadiusKm, latitude, longitude, notes,
  });

  const listings = await FarmerListing.find({ cropId, status: 'Available', quantity: { $gt: 0 } });
  const requiredKg = toKg(quantity, unit);
  const matchedIds = [];
  for (const listing of listings) {
    const availableKg = toKg(listing.quantity, listing.unit);
    if (availableKg < requiredKg) continue;
    const distance = distanceKm(latitude, longitude, listing.latitude, listing.longitude);
    if (distance !== null && distance > pickupRadiusKm) continue;
    if (!matchedIds.some(id => id.toString() === listing.farmerId.toString())) matchedIds.push(listing.farmerId);
  }

  requirement.matchedFarmerIds = matchedIds;
  if (matchedIds.length) requirement.status = 'Farmer Matched';
  await requirement.save();

  if (matchedIds.length) {
    await Notification.insertMany(matchedIds.map(farmerId => ({
      recipientRole: 'farmer', recipientId: farmerId, title: `New buyer requirement: ${cropName || cropId}`,
      message: `${buyer.name} needs ${quantity}${unit} of ${cropName || cropId} at ₹${offerPrice}/kg.`,
      type: 'requirement', relatedId: requirement._id.toString(), actionUrl: `/farmer/requirements/${requirement._id}`,
    })));
  }
  await Notification.create({
    recipientRole: 'buyer', recipientId: buyer._id, title: `${matchedIds.length} matching farmer${matchedIds.length === 1 ? '' : 's'} found`,
    message: matchedIds.length ? `Your ${cropName || cropId} requirement matched nearby farmers.` : `Your requirement is active and we will match farmers when suitable listings appear.`,
    type: 'requirement', relatedId: requirement._id.toString(), actionUrl: `/buyer/requirements/${requirement._id}`,
  });

  res.status(201).json({ requirement, matchCount: matchedIds.length });
}

async function getRequirements(req, res) {
  if (!req.userId) return res.status(401).json({ error: 'Authentication required.' });
  const query = req.userRole === 'buyer' ? { buyerId: req.userId } : { matchedFarmerIds: req.userId };
  const { cropId, status } = req.query;
  if (cropId) query.cropId = cropId;
  if (status) query.status = status;
  const requirements = await BuyerRequirement.find(query).sort({ createdAt: -1 });
  res.json({ requirements });
}

async function getRequirement(req, res) {
  const requirement = await BuyerRequirement.findById(req.params.id);
  if (!requirement) return res.status(404).json({ error: 'Requirement not found.' });
  const allowed = requirement.buyerId.toString() === req.userId || requirement.matchedFarmerIds.some(id => id.toString() === req.userId);
  if (!allowed) return res.status(403).json({ error: 'You are not authorized to view this requirement.' });
  res.json({ requirement });
}

async function acceptRequirement(req, res) {
  const requirement = await BuyerRequirement.findById(req.params.id);
  if (!requirement) return res.status(404).json({ error: 'Requirement not found.' });
  if (req.userRole !== 'farmer') return res.status(403).json({ error: 'Only farmers can accept requirements.' });
  if (!requirement.matchedFarmerIds.some(id => id.toString() === req.userId)) return res.status(403).json({ error: 'You are not an eligible matched farmer for this requirement.' });
  if (requirement.status === 'Accepted' || requirement.status === 'Completed') return res.status(409).json({ error: 'This requirement has already been accepted.' });

  const [farmer, buyer] = await Promise.all([User.findById(req.userId), User.findById(requirement.buyerId)]);
  if (!farmer || !buyer) return res.status(404).json({ error: 'User account not found.' });

  const quantityKg = toKg(requirement.quantity, requirement.unit);
  const order = await Order.create({
    requirementId: requirement._id, cropId: requirement.cropId, cropName: requirement.cropName, cropImage: requirement.cropImage,
    quantity: requirement.quantity, unit: requirement.unit, agreedPricePerKg: requirement.offerPrice, totalAmount: quantityKg * requirement.offerPrice,
    farmerId: farmer._id, farmerName: farmer.name, farmerVillage: farmer.villageOrBusinessName, farmerPhone: farmer.phone, farmerLocation: farmer.location,
    buyerId: buyer._id, buyerName: buyer.name, buyerPhone: buyer.phone, buyerLocation: buyer.location, buyerRating: buyer.rating || 5,
    distanceKm: 0, status: 'accepted',
    pickupDetails: { scheduledDate: requirement.requiredDate, scheduledTimeWindow: 'To be confirmed', driverName: 'Assigned after confirmation', driverPhone: '', vehicleNumber: '', transportStatus: 'Pickup Scheduled', pickupAddress: farmer.location },
    paymentDetails: { status: 'Pending', method: 'UPI / Bank Transfer (Demo)', amount: quantityKg * requirement.offerPrice, breakdown: { quantity: requirement.quantity, unit: requirement.unit, ratePerKg: requirement.offerPrice, totalAmount: quantityKg * requirement.offerPrice, platformFee: 0, netPayoutToFarmer: quantityKg * requirement.offerPrice } },
    timeline: [
      { status: 'posted', label: 'Requirement Posted', description: 'Buyer posted the requirement.', timestamp: requirement.createdAt.toISOString(), completed: true, current: false },
      { status: 'matched', label: 'Farmer Matched', description: `${farmer.name} was matched to this requirement.`, timestamp: new Date().toISOString(), completed: true, current: false },
      { status: 'accepted', label: 'Farmer Accepted', description: `${farmer.name} accepted the requirement.`, timestamp: new Date().toISOString(), completed: true, current: true },
    ],
  });

  requirement.status = 'Accepted';
  await requirement.save();
  await Notification.create({ recipientRole: 'buyer', recipientId: buyer._id, title: 'Farmer accepted your requirement', message: `${farmer.name} accepted your ${requirement.cropName || requirement.cropId} requirement. Order created.`, type: 'order', relatedId: order._id.toString(), actionUrl: `/buyer/orders/${order._id}` });
  await Notification.create({ recipientRole: 'farmer', recipientId: farmer._id, title: 'Order confirmed', message: `Your order for ${requirement.quantity}${requirement.unit} of ${requirement.cropName || requirement.cropId} is confirmed.`, type: 'order', relatedId: order._id.toString(), actionUrl: `/farmer/orders/${order._id}` });
  res.json({ requirement, order });
}

async function declineRequirement(req, res) {
  const requirement = await BuyerRequirement.findById(req.params.id);
  if (!requirement) return res.status(404).json({ error: 'Requirement not found.' });
  if (req.userRole !== 'farmer') return res.status(403).json({ error: 'Only farmers can decline requirements.' });
  if (!requirement.matchedFarmerIds.some(id => id.toString() === req.userId)) return res.status(403).json({ error: 'You are not an eligible matched farmer.' });
  requirement.matchedFarmerIds = requirement.matchedFarmerIds.filter(id => id.toString() !== req.userId);
  if (!requirement.matchedFarmerIds.length) requirement.status = 'Looking for farmers';
  await requirement.save();
  res.json({ requirement });
}

module.exports = { createRequirement, getRequirements, getRequirement, acceptRequirement, declineRequirement };
