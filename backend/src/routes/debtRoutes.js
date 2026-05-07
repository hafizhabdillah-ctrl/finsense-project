const express = require('express');
const auth = require('../middleware/auth');
const debtController = require('../controllers/debtController');
const router = express.Router();

router.use(auth);
router.get('/', debtController.getDebts);
router.post('/', debtController.createDebt);
router.post('/:id/payments', debtController.addPayment);
router.delete('/:id', debtController.deleteDebt);

module.exports = router;
