const axios = require('axios');
const MarketPrice = require('../models/MarketPrice');
const CropMaster = require('../models/CropMaster');

const BASE_URL = 'https://api.data.gov.in/resource';

// Which of your CropMaster crops map to which AGMARKNET "commodity" name.
// AGMARKNET's naming doesn't always match casual crop names, so keep this list updated
// as you add crops. You can discover exact names by calling the API once with no filter
// and inspecting the "commodity" field of the results.
const CROP_TO_COMMODITY = {
  tomato: 'Tomato',
  onion: 'Onion',
  potato: 'Potato',
  chilli: 'Green Chilly',
  paddy: 'Paddy(Dhan)(Common)',
  // add more crop-id -> AGMARKNET commodity name pairs here
};

// Tracks the last date we successfully synced, so we only hit the API again once the
// government source itself has moved to a new date (this satisfies the
// "update whenever the date changes" requirement without polling pointlessly).
let lastSyncedDate = null;

async function fetchCommodityPrices(commodity, { state, limit = 200 } = {}) {
  const apiKey = process.env.DATA_GOV_IN_API_KEY;
  const resourceId = process.env.DATA_GOV_IN_RESOURCE_ID;

  if (!apiKey || apiKey === 'your_data_gov_in_api_key') {
    throw new Error(
      'DATA_GOV_IN_API_KEY is not set. Get a free key at https://data.gov.in (My Account -> API Key) and add it to .env'
    );
  }

  const params = {
    'api-key': apiKey,
    format: 'json',
    limit,
    'filters[commodity]': commodity,
  };
  if (state) params['filters[state]'] = state;

  const { data } = await axios.get(`${BASE_URL}/${resourceId}`, { params, timeout: 15000 });
  return data.records || [];
}

async function upsertRecords(records) {
  let inserted = 0;
  let latestDateSeen = null;

  for (const rec of records) {
    // The dataset's field names as published on data.gov.in
    const doc = {
      state: rec.state,
      district: rec.district,
      market: rec.market,
      commodity: rec.commodity,
      variety: rec.variety,
      minPrice: Number(rec.min_price) || 0,
      maxPrice: Number(rec.max_price) || 0,
      modalPrice: Number(rec.modal_price) || 0,
      arrivalQuantity: rec.arrival ? Number(rec.arrival) : undefined,
      date: rec.arrival_date,
      source: 'AGMARKNET',
    };

    if (!doc.state || !doc.market || !doc.commodity || !doc.date) continue;

    await MarketPrice.updateOne(
      { state: doc.state, market: doc.market, commodity: doc.commodity, date: doc.date },
      { $set: doc },
      { upsert: true }
    );
    inserted += 1;
    latestDateSeen = doc.date;
  }

  return { inserted, latestDateSeen };
}

// Recomputes each CropMaster's marketPrice/nearbyMarkets from the freshest rows we have,
// which is what the farmer dashboard actually reads.
async function refreshCropMasterSnapshots() {
  const crops = await CropMaster.find({});

  for (const crop of crops) {
    const commodity = CROP_TO_COMMODITY[crop.id];
    if (!commodity) continue;

    const latest = await MarketPrice.find({ commodity }).sort({ date: -1, updatedAt: -1 }).limit(6);
    if (latest.length === 0) continue;

    const modalPricesPerKg = latest.map((r) => r.modalPrice / 100); // AGMARKNET prices are per quintal
    const avgPerKg = modalPricesPerKg.reduce((a, b) => a + b, 0) / modalPricesPerKg.length;

    crop.marketPrice = Math.round(avgPerKg * 100) / 100;
    crop.pricePerQuintal = Math.round(avgPerKg * 100);
    crop.lastUpdated = new Date().toISOString();
    crop.nearbyMarkets = latest.slice(0, 4).map((r) => ({
      name: r.market,
      price: Math.round((r.modalPrice / 100) * 100) / 100,
    }));

    await crop.save();
  }
}

// Runs one full sync pass across every crop you've mapped above.
async function runMarketSync({ force = false } = {}) {
  const commodities = Object.values(CROP_TO_COMMODITY);
  let totalInserted = 0;
  let newestDate = lastSyncedDate;

  for (const commodity of commodities) {
    try {
      const records = await fetchCommodityPrices(commodity);
      const { inserted, latestDateSeen } = await upsertRecords(records);
      totalInserted += inserted;
      if (latestDateSeen) newestDate = latestDateSeen;
    } catch (err) {
      console.error(`Market sync failed for "${commodity}":`, err.message);
    }
  }

  if (newestDate && (force || newestDate !== lastSyncedDate)) {
    lastSyncedDate = newestDate;
    await refreshCropMasterSnapshots();
    console.log(`Market sync: ${totalInserted} rows upserted. Government data date: ${newestDate}.`);
  } else {
    console.log('Market sync: no new government data date since last check. Nothing to update.');
  }

  return { totalInserted, date: lastSyncedDate };
}

module.exports = { runMarketSync, CROP_TO_COMMODITY };
