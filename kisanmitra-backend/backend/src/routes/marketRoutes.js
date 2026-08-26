const express = require('express');
const router = express.Router();
const { listCrops, getCrop, getHistory, getNearbyPrices, triggerSync } = require('../controllers/marketController');

router.get('/crops', listCrops);
router.get('/crops/:cropId', getCrop);
router.get('/history', getHistory);
router.get('/nearby', getNearbyPrices);
router.post('/sync', triggerSync); // add requireAuth + admin check before going to production

module.exports = router;
