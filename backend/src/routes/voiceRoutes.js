const express = require('express');
const auth = require('../middleware/auth');
const voiceController = require('../controllers/voiceController');
const router = express.Router();

router.post(
  '/voice',
  auth,
  voiceController.uploadAudio,
  voiceController.processVoice,
);

module.exports = router;
