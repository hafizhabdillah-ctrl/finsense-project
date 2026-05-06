const express = require('express');
const auth = require('../middleware/auth');
const {
  getAnomalies,
  reviewAnomaly,
  createAnomaly,
} = require('../controllers/anomalyController');
const router = express.Router();

router.use(auth);
router.post('/', createAnomaly);
router.get('/', getAnomalies);
router.patch('/:id', reviewAnomaly);

module.exports = router;
