const express = require('express');
const auth = require('../middleware/auth');
const stockLogController = require('../controllers/stockLogController');
const router = express.Router();

router.use(auth);
router.get('/', stockLogController.getStockLogs);
router.post('/', stockLogController.createStockLog);

module.exports = router;
