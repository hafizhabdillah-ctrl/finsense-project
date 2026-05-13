const express = require('express');
const auth = require('../middleware/auth');
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionById,
} = require('../controllers/transactionController');
const router = express.Router();

router.use(auth);
router.get('/', getTransactions);
router.get('/:id', getTransactionById);
router.post('/', createTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
