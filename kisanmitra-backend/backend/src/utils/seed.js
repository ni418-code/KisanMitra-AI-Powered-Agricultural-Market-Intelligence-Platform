// Run with: npm run seed
// Populates CropMaster with the starter crops your frontend already expects.
// Run this ONCE before starting the server for the first time.
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const CropMaster = require('../models/CropMaster');

const STARTER_CROPS = [
  {
    id: 'tomato', name: 'Tomato', category: 'Vegetables', defaultUnit: 'kg', mspPrice: null,
    localNames: { en: 'Tomato', te: 'టమాట', hi: 'टमाटर', ta: 'தக்காளி', mr: 'टोमॅटो' },
    description: 'Fresh farm-gate tomatoes suitable for retail and processing.',
  },
  {
    id: 'onion', name: 'Onion', category: 'Vegetables', defaultUnit: 'kg', mspPrice: null,
    localNames: { en: 'Onion', te: 'ఉల్లిపాయ', hi: 'प्याज', ta: 'வெங்காயம்', mr: 'कांदा' },
    description: 'Red onion, common variety.',
  },
  {
    id: 'potato', name: 'Potato', category: 'Vegetables', defaultUnit: 'kg', mspPrice: null,
    localNames: { en: 'Potato', te: 'బంగాళదుంప', hi: 'आलू', ta: 'உருளைக்கிழங்கு', mr: 'बटाटा' },
    description: 'Table potato.',
  },
  {
    id: 'chilli', name: 'Green Chilli', category: 'Spices', defaultUnit: 'kg', mspPrice: null,
    localNames: { en: 'Green Chilli', te: 'పచ్చిమిర్చి', hi: 'हरी मिर्च', ta: 'பச்சை மிளகாய்', mr: 'हिरवी मिरची' },
    description: 'Fresh green chilli.',
  },
  {
    id: 'paddy', name: 'Paddy', category: 'Grains', defaultUnit: 'quintal', mspPrice: 2300,
    localNames: { en: 'Paddy', te: 'వరి', hi: 'धान', ta: 'நெல்', mr: 'भात' },
    description: 'Common paddy (rice). Has a statutory government MSP.',
  },
];

async function seed() {
  await connectDB();
  for (const crop of STARTER_CROPS) {
    await CropMaster.updateOne({ id: crop.id }, { $set: crop }, { upsert: true });
  }
  console.log(`Seeded ${STARTER_CROPS.length} crops.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
