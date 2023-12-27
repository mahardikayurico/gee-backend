const { spawnSync } = require('child_process');
const ee = require('@google/earthengine');

// Inisialisasi Earth Engine
ee.initialize();

class TransitionModel {
  static async calculateTransitionMatrix(geoJson, landCover2011, landCover2021) {
    try {
      // Load land cover images
      const landCover2011Image = ee.Image(landCover2011);
      const landCover2021Image = ee.Image(landCover2021);

      // Convert GeoJSON to an Earth Engine geometry
      const region = ee.Geometry.Polygon(geoJson.features[0].geometry.coordinates);

      // Clip land cover images to the region of interest
      const clippedLandCover2011 = landCover2011Image.clip(region);
      const clippedLandCover2021 = landCover2021Image.clip(region);

      // Calculate the transition matrix or any desired computation
      // ...

      // Example: Calculate difference between two land cover images
      const difference = clippedLandCover2021.subtract(clippedLandCover2011);

      // Get the result as an Earth Engine dictionary
      const resultDictionary = await difference.reduceRegion({
        reducer: ee.Reducer.frequencyHistogram(),
        geometry: region,
        scale: 30, // Adjust the scale accordingly
      });

      // Convert the result to JavaScript object
      const resultObject = ee.Dictionary(resultDictionary).getInfo();

      return resultObject;
    } catch (error) {
      console.error('Error during calculation:', error);
      throw new Error('Internal Server Error');
    }
  }
}

module.exports = TransitionModel;
