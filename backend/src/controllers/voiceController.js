const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const prisma = require('../config/prisma');

const upload = multer({ storage: multer.memoryStorage() });
const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

async function findClosestProduct(userId, predictedPrice) {
  try {
    const products = await prisma.product.findMany({
      where: { user_id: userId },
      select: { id: true, name: true, price: true },
    });
    if (!products.length) return null;
    let closest = products[0];
    let minDiff = Math.abs(closest.price - predictedPrice);
    for (const p of products) {
      const diff = Math.abs(p.price - predictedPrice);
      if (diff < minDiff) {
        minDiff = diff;
        closest = p;
      }
    }
    return closest;
  } catch (err) {
    console.error('Error in findClosestProduct:', err);
    return null;
  }
}

exports.processVoice = async (req, res) => {
  try {
    console.log(
      '[Voice] Request received, file:',
      req.file ? req.file.originalname : 'none',
    );
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file' });
    }

    const form = new FormData();
    form.append('audio', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    console.log('[Voice] Calling FastAPI...');
    const aiResponse = await axios.post(`${FASTAPI_URL}/predict`, form, {
      headers: form.getHeaders(),
      timeout: 60000,
    });
    console.log('[Voice] FastAPI response:', aiResponse.data);

    const { jumlah, harga, jumlah_confidence } = aiResponse.data;
    const userId = req.userId;

    const matchedProduct = await findClosestProduct(userId, harga);

    const responseData = {
      success: true,
      jumlah,
      jumlah_confidence,
      harga,
      matchedProduct: matchedProduct
        ? {
            id: matchedProduct.id,
            name: matchedProduct.name,
            price: matchedProduct.price,
          }
        : null,
    };
    console.log('[Voice] Sending response:', responseData);
    res.json(responseData);
  } catch (err) {
    console.error('[Voice] ERROR:', err);
    // Pastikan error sampai ke client
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

exports.uploadAudio = upload.single('audio');
