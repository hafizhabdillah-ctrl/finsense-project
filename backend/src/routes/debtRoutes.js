const express = require('express');
const auth = require('../middleware/auth');
const debtController = require('../controllers/debtController');
const router = express.Router();

router.use(auth);
router.get('/', debtController.getDebts);
router.post('/', debtController.createDebt);
router.post('/:id/payments', debtController.addPayment);
router.delete('/:id', debtController.deleteDebt);
router.get('/:id', debtController.getDebtById);
router.put('/:id', debtController.updateDebt);

module.exports = router;
