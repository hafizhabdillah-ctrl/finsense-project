const express = require('express');
const {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  updateProfile,
} = require('../controllers/authController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

module.exports = router;
