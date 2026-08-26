const mongoose = require('mongoose');

// Mirrors src/types/index.ts -> CropMaster on the frontend, so this collection can be
// sent to the app with no transformation needed.
const cropMasterSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // e.g. "tomato" - used to match AGMARKNET commodity names too
  name: { type: String, required: true },
  localNames: {
    en: String,
    te: String,
    hi: String,
    ta: String,
    mr: String,
  },
  category: {
    type: String,
    enum: ['Vegetables', 'Grains', 'Spices', 'Pulses', 'Fruits'],
    required: true,
  },
  image: { type: String },
  defaultUnit: { type: String, enum: ['kg', 'quintal'], default: 'kg' },
  mspPrice: { type: Number, default: null }, // rupees/quintal, null if crop has no statutory MSP
  marketPrice: { type: Number, default: 0 }, // rupees/kg, derived from latest MarketPrice modal price
  pricePerQuintal: { type: Number, default: 0 },
  lastUpdated: { type: String },
  nearbyMarkets: [
    {
      name: String,
      price: Number,
    },
  ],
  description: { type: String },
});

module.exports = mongoose.model('CropMaster', cropMasterSchema);
