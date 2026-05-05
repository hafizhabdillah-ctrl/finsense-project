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
router.get('/trend', getMonthlyExpenseTrend);
router.get('/correlation', getCategoryCorrelation);
router.get('/anomaly-insights', getAnomalyInsights);
router.get('/summary', getMonthlySummary);
router.post('/generate', generateFinancialReport);

module.exports = router;
