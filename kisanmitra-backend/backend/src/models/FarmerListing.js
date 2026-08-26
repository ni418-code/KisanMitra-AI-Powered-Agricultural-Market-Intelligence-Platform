const mongoose = require('mongoose');

const farmerListingSchema = new mongoose.Schema(
  {
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    farmerName: String,
    farmerVillage: String,
    farmerState: String,
    farmerPhone: String,
    farmerRating: Number,
    cropId: { type: String, required: true },
    cropName: String,
    cropImage: String,
    quantity: { type: Number, required: true },
    unit: { type: String, enum: ['kg', 'quintal'], default: 'kg' },
    location: String,
    latitude: Number,
    longitude: Number,
    availableDate: String,
    status: { type: String, enum: ['Available', 'Reserved', 'Sold'], default: 'Available' },
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('FarmerListing', farmerListingSchema);
