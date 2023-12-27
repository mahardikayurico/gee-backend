const express = require('express');
const { ee } = require('@google/earthengine');

const app = express();
const port = 3002;

app.use(express.json());

/// Middleware untuk menginisialisasi Earth Engine
app.use(async (req, res, next) => {
  try {
      // Ambil kredensial dari .env
      const privateKey = process.env.GEE_PRIVATE_KEY;
      const clientEmail = process.env.GEE_CLIENT_EMAIL;

      // Import Earth Engine
      const ee = require('@google/earthengine');

      // Inisialisasi Earth Engine
      await ee.initialize({
          privateKey,
          clientEmail,
          force: false,
      }, () => {
          console.log('Earth Engine initialized successfully.');
          next();
      });
  } catch (error) {
      console.error('Gagal menginisialisasi Earth Engine:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint untuk menghitung matriks transisi
app.post('/transition-matrix', async (req, res) => {
  try {
    const geoJsonData = req.body;

    // Ambil data land cover tahun 2011 dan 2021 dari Google Earth Engine
    const landCover2011 = ee.Image('projects/ee-ramadhan/assets/PL_KLHK_Raster_v1/KLHK_PL_2011_raster_v1');
    const landCover2021 = ee.Image('projects/ee-ramadhan/assets/PL_KLHK_Raster_v1/KLHK_PL_2021_raster_v1');

    // TODO: Tambahkan logika penghitungan matriks transisi di sini menggunakan GEE
    const transitionMatrix = calculateTransitionMatrix(landCover2011, landCover2021);

    res.json(transitionMatrix);
  } catch (error) {
    console.error('Gagal menghitung matriks transisi:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Logika penghitungan matriks transisi
function calculateTransitionMatrix(landCover2011, landCover2021) {
  // TODO: Isi dengan logika GEE untuk menghitung matriks transisi
  // Contoh dummy untuk tujuan ilustrasi
  const transitionMatrix = {
    classes: ['Forest', 'Urban', 'Agriculture'],
    matrix: [
      [1000, 200, 50],
      [150, 800, 30],
      [20, 10, 500],
    ],
  };

  return transitionMatrix;
}

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
