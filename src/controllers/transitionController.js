// controllers/landCoverController.js
const landCoverModel = require('../models/transitionModel');
const earthEngineHelper = require('../helpers/earthEngineHelper');

async function calculateTransitionMatrix(req, res) {
  try {
    const geoJSON = req.body;

    const coordinates = extractCoordinates(geoJSON);
    const transitionMatrix = await earthEngineHelper.getTransitionMatrix(coordinates);

    res.json({ transitionMatrix });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

function extractCoordinates(geoJSON) {
  const coordinates = geoJSON.features[0].geometry.coordinates[0]; // Assuming the first feature is a Polygon
  return coordinates;
}

module.exports = {
  calculateTransitionMatrix,
};
