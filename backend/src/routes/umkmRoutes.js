const express = require('express');
const auth = require('../middleware/auth');
const {
  getUmkmProfile,
  createOrUpdateUmkmProfile,
} = require('../controllers/umkmController');
const router = express.Router();

router.use(auth);
router.get('/', getUmkmProfile);
router.post('/', createOrUpdateUmkmProfile);

module.exports = router;
