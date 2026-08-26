const BuyerRequirement = require('../models/BuyerRequirement');
const Notification = require('../models/Notification');
const User = require('../models/User');

// POST /api/requirements (buyer only) -- also fans out a notification to farmers
async function createRequirement(req, res) {
  const buyer = await User.findById(req.userId);
  if (!buyer || buyer.role !== 'buyer') {
    return res.status(403).json({ error: 'Only buyer accounts can post requirements.' });
  }

  const { cropId, cropName, cropImage, quantity, unit, offerPrice, requiredDate, pickupRadiusKm, latitude, longitude, notes } = req.body;
  if (!cropId || !quantity || !offerPrice) {
    return res.status(400).json({ error: 'cropId, quantity and offerPrice are required.' });
  }

  const requirement = await BuyerRequirement.create({
    buyerId: buyer._id,
    buyerName: buyer.name,
    buyerLocation: buyer.location,
    buyerPhone: buyer.phone,
    buyerRating: buyer.rating,
    verifiedPurchases: buyer.completedOrdersCount,
    cropId,
    cropName,
    cropImage,
    quantity,
    unit: unit || 'kg',
    offerPrice,
    totalEstimatedValue: quantity * offerPrice,
    requiredDate,
    pickupRadiusKm: pickupRadiusKm || 25,
    latitude,
    longitude,
    notes,
  });

  await Notification.create({
    recipientRole: 'farmer',
    title: `New buyer requirement: ${cropName || cropId}`,
    message: `${buyer.name} needs ${quantity}${unit || 'kg'} of ${cropName || cropId} at ₹${offerPrice}/kg.`,
    type: 'requirement',
    relatedId: requirement._id.toString(),
  });

  res.status(201).json({ requirement });
}

// GET /api/requirements?cropId=tomato&status=Looking for farmers&sort=price_desc
async function getRequirements(req, res) {
  const { cropId, status, sort } = req.query;
  const query = {};
  if (cropId) query.cropId = cropId;
  if (status) query.status = status;

  let cursor = BuyerRequirement.find(query);
  if (sort === 'price_desc') cursor = cursor.sort({ offerPrice: -1 });
  else if (sort === 'price_asc') cursor = cursor.sort({ offerPrice: 1 });
  else if (sort === 'quantity_desc') cursor = cursor.sort({ quantity: -1 });
  else cursor = cursor.sort({ createdAt: -1 });

  const requirements = await cursor;
  res.json({ requirements });
}

// PUT /api/requirements/:id/status  { status: 'Accepted' | 'Cancelled' | ... }
// This is how a farmer's "accept" or "reject" action against a buyer request is recorded.
async function updateRequirementStatus(req, res) {
  const requirement = await BuyerRequirement.findById(req.params.id);
  if (!requirement) return res.status(404).json({ error: 'Requirement not found.' });

  const { status, farmerId } = req.body;
  const allowed = ['Looking for farmers', 'Farmer Matched', 'Accepted', 'Completed', 'Cancelled'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${allowed.join(', ')}` });
  }

  requirement.status = status;
  if (farmerId && !requirement.matchedFarmerIds.includes(farmerId)) {
    requirement.matchedFarmerIds.push(farmerId);
  }
  await requirement.save();

  await Notification.create({
    recipientRole: 'buyer',
    recipientId: requirement.buyerId,
    title: `Your requirement was updated: ${status}`,
    message: `Your request for ${requirement.cropName || requirement.cropId} is now "${status}".`,
    type: 'requirement',
    relatedId: requirement._id.toString(),
  });

  res.json({ requirement });
}

module.exports = { createRequirement, getRequirements, updateRequirementStatus };
