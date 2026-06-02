const express = require('express');
const router = express.Router();
const voiceController = require('../controllers/voiceController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/voice', upload.single('audio'), voiceController.processVoice);
router.post('/voice-transcript', voiceController.processTranscript);

module.exports = router;
