const express = require('express');
const auth = require('../middleware/auth');
const {
  getBudgets,
  createOrUpdateBudget,
  deleteBudget,
} = require('../controllers/budgetController');
const router = express.Router();

router.use(auth);
router.get('/', getBudgets);
router.post('/', createOrUpdateBudget);
router.delete('/:id', deleteBudget);

module.exports = router;
