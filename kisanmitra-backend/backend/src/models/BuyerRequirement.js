const mongoose = require('mongoose');

const buyerRequirementSchema = new mongoose.Schema(
  {
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    buyerName: String,
    buyerLocation: String,
    buyerPhone: String,
    buyerRating: Number,
    verifiedPurchases: { type: Number, default: 0 },
    cropId: { type: String, required: true },
    cropName: String,
    cropImage: String,
    quantity: { type: Number, required: true },
    unit: { type: String, enum: ['kg', 'quintal'], default: 'kg' },
    offerPrice: { type: Number, required: true }, // rupees/kg
    totalEstimatedValue: Number,
    requiredDate: String,
    pickupRadiusKm: { type: Number, default: 25 },
    latitude: Number,
    longitude: Number,
    status: {
      type: String,
      enum: ['Looking for farmers', 'Farmer Matched', 'Accepted', 'Completed', 'Cancelled'],
      default: 'Looking for farmers',
    },
    matchedFarmerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('BuyerRequirement', buyerRequirementSchema);
