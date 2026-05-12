const express = require('express');
const auth = require('../middleware/auth');
const stockLogController = require('../controllers/stockLogController');
const router = express.Router();

router.use(auth);
router.get('/', stockLogController.getStockLogs);
router.post('/', stockLogController.createStockLog);
router.put('/:id', stockLogController.updateStockLog);
router.delete('/:id', stockLogController.deleteStockLog);

module.exports = router;
