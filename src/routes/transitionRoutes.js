// routes/landCoverRoutes.js
const express = require('express');
const landCoverController = require('../controllers/transitionController');

const router = express.Router();

router.post('/transition-matrix', landCoverController.calculateTransitionMatrix);

module.exports = router;
