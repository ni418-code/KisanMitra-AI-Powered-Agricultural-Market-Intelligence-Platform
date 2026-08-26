const CropMaster = require('../models/CropMaster');
const MarketPrice = require('../models/MarketPrice');
const { runMarketSync } = require('../jobs/marketDataSync');

// GET /api/market/crops -- what the farmer home screen renders directly
async function listCrops(req, res) {
  const crops = await CropMaster.find({}).sort({ name: 1 });
  res.json({ crops });
}

async function getCrop(req, res) {
  const crop = await CropMaster.findOne({ id: req.params.cropId });
  if (!crop) return res.status(404).json({ error: 'Crop not found.' });
  res.json({ crop });
}

// GET /api/market/history?commodity=Tomato&market=Guntur&days=30
async function getHistory(req, res) {
  const { commodity, market, state, days = 30 } = req.query;
  if (!commodity) return res.status(400).json({ error: 'commodity query param is required.' });

  const query = { commodity };
  if (market) query.market = market;
  if (state) query.state = state;

  const records = await MarketPrice.find(query)
    .sort({ date: -1 })
    .limit(Number(days))
    .lean();

  res.json({
    history: records
      .map((r) => ({ date: r.date, minPrice: r.minPrice, maxPrice: r.maxPrice, modalPrice: r.modalPrice }))
      .reverse(),
  });
}

// GET /api/market/nearby?commodity=Tomato&state=Andhra%20Pradesh
async function getNearbyPrices(req, res) {
  const { commodity, state, limit = 10 } = req.query;
  if (!commodity) return res.status(400).json({ error: 'commodity query param is required.' });

  const query = { commodity };
  if (state) query.state = state;

  const latestDateDoc = await MarketPrice.findOne(query).sort({ date: -1 });
  if (!latestDateDoc) return res.json({ markets: [] });

  const markets = await MarketPrice.find({ ...query, date: latestDateDoc.date })
    .sort({ modalPrice: -1 })
    .limit(Number(limit));

  res.json({ markets });
}

// POST /api/market/sync -- lets an admin (or you, while testing) trigger a sync on demand
// instead of waiting for the cron schedule.
async function triggerSync(req, res) {
  try {
    const result = await runMarketSync({ force: true });
    res.json({ message: 'Sync complete.', ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { listCrops, getCrop, getHistory, getNearbyPrices, triggerSync };
