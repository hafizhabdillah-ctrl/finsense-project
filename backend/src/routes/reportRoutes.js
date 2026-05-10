const express = require('express');
const auth = require('../middleware/auth');
const {
  getMonthlyExpenseTrend,
  getCategoryCorrelation,
  getAnomalyInsights,
  getMonthlySummary,
  generateFinancialReport,
} = require('../controllers/reportController');
const router = express.Router();

router.use(auth);
router.get('/trends', getMonthlyExpenseTrend);
router.get('/correlations', getCategoryCorrelation);
router.get('/anomaly-insights', getAnomalyInsights);
router.get('/summaries', getMonthlySummary);
router.post('/', generateFinancialReport);

module.exports = router;
