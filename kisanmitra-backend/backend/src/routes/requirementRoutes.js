const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { createRequirement, getRequirements, getRequirement, acceptRequirement, declineRequirement } = require('../controllers/requirementController');

router.get('/', requireAuth, getRequirements);
router.get('/:id', requireAuth, getRequirement);
router.post('/', requireAuth, createRequirement);
router.post('/:id/accept', requireAuth, acceptRequirement);
router.post('/:id/decline', requireAuth, declineRequirement);
router.put('/:id/status', requireAuth, async (req, res) => res.status(410).json({ error: 'Use the accept or decline endpoints for farmer actions.' }));

module.exports = router;
