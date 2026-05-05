const express = require('express');
const auth = require('../middleware/auth');
const {
  getForecasts,
  createForecast,
} = require('../controllers/forecastController');
const router = express.Router();

router.use(auth);
router.get('/', getForecasts);
router.post('/', createForecast); // untuk AI service

module.exports = router;
