const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { createListing, getListings, getListing, updateListing, deleteListing } = require('../controllers/listingController');

router.get('/', requireAuth, getListings);
router.get('/:id', requireAuth, getListing);
router.post('/', requireAuth, createListing);
router.put('/:id', requireAuth, updateListing);
router.delete('/:id', requireAuth, deleteListing);

module.exports = router;
