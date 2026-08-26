const mongoose = require('mongoose');

// One document per (commodity + market + date) reported by AGMARKNET / data.gov.in.
// This is your OWN historical record -- the government API only gives you "today's" snapshot,
// so every sync run inserts new rows here rather than overwriting old ones.
const marketPriceSchema = new mongoose.Schema(
  {
    state: { type: String, required: true, index: true },
    district: { type: String },
    market: { type: String, required: true, index: true },
    commodity: { type: String, required: true, index: true },
    variety: { type: String },
    minPrice: { type: Number, required: true }, // rupees per quintal
    maxPrice: { type: Number, required: true },
    modalPrice: { type: Number, required: true },
    arrivalQuantity: { type: Number },
    date: { type: String, required: true, index: true }, // "DD/MM/YYYY" as reported by the source
    source: { type: String, default: 'AGMARKNET' },
  },
  { timestamps: true }
);

// Prevents duplicate rows if the sync job runs twice for the same day/market/commodity
marketPriceSchema.index({ state: 1, market: 1, commodity: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('MarketPrice', marketPriceSchema);
