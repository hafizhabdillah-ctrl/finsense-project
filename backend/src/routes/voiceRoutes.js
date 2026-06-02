const express = require('express');
// const auth = require('../middleware/auth');
const router = express.Router();
const voiceController = require('../controllers/voiceController');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/voice', upload.single('audio'), voiceController.processVoice);
router.post('/voice-transcript', async (req, res) => {
  const { transcript } = req.body;
  // Panggil fungsi Python (via child_process) atau langsung pakai `inference_wrapper_v10.process_transcript`
  const result = await callPythonProcess(transcript);
  res.json(result);
});

module.exports = router;
