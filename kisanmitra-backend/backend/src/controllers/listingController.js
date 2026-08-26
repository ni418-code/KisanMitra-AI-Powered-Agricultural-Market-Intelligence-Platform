const FarmerListing = require('../models/FarmerListing');
const User = require('../models/User');

async function createListing(req, res) {
  const farmer = await User.findById(req.userId);
  if (!farmer || farmer.role !== 'farmer') return res.status(403).json({ error: 'Only farmer accounts can create listings.' });
  const { cropId, cropName, cropImage, quantity, unit = 'kg', location, latitude, longitude, availableDate, notes } = req.body;
  if (!cropId || !quantity || quantity <= 0) return res.status(400).json({ error: 'cropId and positive quantity are required.' });
  const listing = await FarmerListing.create({ farmerId: farmer._id, farmerName: farmer.name, farmerVillage: farmer.villageOrBusinessName, farmerState: farmer.state, farmerPhone: farmer.phone, farmerRating: farmer.rating, cropId, cropName, cropImage, quantity, unit, location: location || farmer.location, latitude, longitude, availableDate, notes });
  res.status(201).json({ listing });
}

async function getListings(req, res) {
  if (!req.userId) return res.status(401).json({ error: 'Authentication required.' });
  const query = {};
  const { cropId, status } = req.query;
  if (cropId) query.cropId = cropId;
  if (status) query.status = status;
  if (req.userRole === 'farmer') query.farmerId = req.userId;
  else query.status = status || 'Available';
  const listings = await FarmerListing.find(query).sort({ createdAt: -1 });
  res.json({ listings });
}

async function getListing(req, res) {
  const listing = await FarmerListing.findById(req.params.id);
  if (!listing) return res.status(404).json({ error: 'Listing not found.' });
  const isOwner = listing.farmerId.toString() === req.userId;
  if (req.userRole === 'farmer' && !isOwner) return res.status(403).json({ error: 'You can only view your own listings.' });
  res.json({ listing });
}

async function updateListing(req, res) {
  const listing = await FarmerListing.findById(req.params.id);
  if (!listing) return res.status(404).json({ error: 'Listing not found.' });
  if (listing.farmerId.toString() !== req.userId) return res.status(403).json({ error: 'You can only edit your own listings.' });
  const allowedFields = ['quantity', 'unit', 'location', 'availableDate', 'status', 'notes'];
  for (const field of allowedFields) if (req.body[field] !== undefined) listing[field] = req.body[field];
  await listing.save();
  res.json({ listing });
}

async function deleteListing(req, res) {
  const listing = await FarmerListing.findById(req.params.id);
  if (!listing) return res.status(404).json({ error: 'Listing not found.' });
  if (listing.farmerId.toString() !== req.userId) return res.status(403).json({ error: 'You can only delete your own listings.' });
  await listing.deleteOne();
  res.json({ message: 'Listing deleted.' });
}

module.exports = { createListing, getListings, getListing, updateListing, deleteListing };
