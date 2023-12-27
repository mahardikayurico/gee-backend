// earthEngineHelper.js
const ee = require('@google/earthengine');

// Set your Earth Engine credentials (you need to have an Earth Engine account)
const EE_USERNAME = 'yurico-gee-landcover@gee-landcover.iam.gserviceaccount.com';
const EE_PRIVATE_KEY_FILE = '/home/mahardikayurico12/project/gis-dev/backend-gee/src/config/gee-landcover-c1a8c5ff098e.json';

// Initialize Google Earth Engine
async function init() {
  try {
    await ee.initialize(null, {
      keyFile: EE_PRIVATE_KEY_FILE,
      email: EE_USERNAME,
    });
    console.log('Earth Engine initialized successfully.');
  } catch (error) {
    console.error('Error initializing Earth Engine:', error);
    throw error;
  }
}
// Get the transition matrix based on land cover data
async function getImageTransitionMatrix(geoJson) {
  // Load GeoJSON as an Earth Engine geometry
  const geometry = Geometry(geoJson);

  // Example: Load land cover images
  const landCover2011 = Image('projects/ee-ramadhan/assets/PL_KLHK_Raster_v1/KLHK_PL_2011_raster_v1');
  const landCover2021 = Image('projects/ee-ramadhan/assets/PL_KLHK_Raster_v1/KLHK_PL_2021_raster_v1');

  // Example: Calculate transition matrix
  const transitionMatrix = await calculateTransitionMatrix(landCover2011, landCover2021, geometry);

  return transitionMatrix;
}

// Example: Implement your logic to calculate the transition matrix
async function calculateTransitionMatrix(landCover2011, landCover2021, geometry) {
  // Select land cover bands for 2011 and 2021
  const lc2011 = landCover2011.select(['land_cover']);
  const lc2021 = landCover2021.select(['land_cover']);

  // Clip land cover images to the specified geometry
  const lc2011Clipped = lc2011.clip(geometry);
  const lc2021Clipped = lc2021.clip(geometry);

  // Get the land cover values as arrays
  const lcValues2011 = await getImageValues(lc2011Clipped);
  const lcValues2021 = await getImageValues(lc2021Clipped);

  // Initialize transition matrix
  const transitionMatrix = {};

  // Loop through the arrays and count transitions
  lcValues2011.forEach((lcValue2011, index) => {
    const lcValue2021 = lcValues2021[index];

    if (!transitionMatrix[lcValue2011]) {
      transitionMatrix[lcValue2011] = {};
    }

    if (!transitionMatrix[lcValue2011][lcValue2021]) {
      transitionMatrix[lcValue2011][lcValue2021] = 1;
    } else {
      transitionMatrix[lcValue2011][lcValue2021]++;
    }
  });

  return transitionMatrix;
}

// Helper function to get land cover values from an image
async function getImageValues(image) {
  // Get the region of interest
  const roi = await image.geometry();

  // Get the land cover values as an array
  const lcValues = await image.reduceRegion({
    reducer: 'mode',
    geometry: roi,
    scale: 30, // Adjust the scale based on your data
  });

  return lcValues.get('land_cover');
}

module.exports = { init, getImageTransitionMatrix };
