const express = require('express');
const auth = require('../middleware/auth');
const { getModels } = require('../controllers/aiModelController');
const router = express.Router();

router.use(auth);
router.get('/', getModels);

module.exports = router;
