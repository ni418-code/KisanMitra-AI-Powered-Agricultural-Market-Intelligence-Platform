const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { createRequirement, getRequirements, updateRequirementStatus } = require('../controllers/requirementController');

router.get('/', getRequirements);
router.post('/', requireAuth, createRequirement);
router.put('/:id/status', requireAuth, updateRequirementStatus);

module.exports = router;
