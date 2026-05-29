const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const prisma = require('../config/prisma');

// Helper: normalisasi string (aman untuk input non-string)
const normalize = (str) =>
  String(str || '')
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .trim();

/**
 * Mencari produk di database berdasarkan nama prediksi dan alternatif top3
 * @param {string} predictedName - Nama produk hasil prediksi model
 * @param {Array} top3Alternatives - Alternatif top3 dari model (opsional)
 * @returns {Promise<Object|null>} Produk yang cocok atau null
 */
async function findProductByPrediction(predictedName, top3Alternatives = []) {
  const allProducts = await prisma.product.findMany({
    select: { id: true, name: true, price: true },
  });
  if (!allProducts.length) return null;

  const normalizedPredicted = normalize(predictedName);
  const normalizedAlternatives = (top3Alternatives || []).map((alt) =>
    normalize(alt),
  );

  // 1. Coba kecocokan persis (exact match)
  for (const prod of allProducts) {
    const normalizedProd = normalize(prod.name);
    if (normalizedProd === normalizedPredicted) return prod;
    if (normalizedAlternatives.includes(normalizedProd)) return prod;
  }

  // 2. Fallback: partial match berdasarkan kata (overlap)
  const predictedWords = new Set(normalizedPredicted.split(/\s+/));
  let bestMatch = null;
  let bestOverlap = 0;
  for (const prod of allProducts) {
    const prodNorm = normalize(prod.name);
    const prodWords = new Set(prodNorm.split(/\s+/));
    const overlap = [...predictedWords].filter((w) => prodWords.has(w)).length;
    if (overlap > bestOverlap) {
      bestOverlap = overlap;
      bestMatch = prod;
    }
  }
  return bestOverlap >= 1 ? bestMatch : null;
}

/**
 * Mencari produk dari transkrip (fallback saat confidence rendah atau produk tidak ditemukan)
 * @param {string} transcript - Teks transkrip
 * @returns {Promise<Object|null>} Produk yang cocok atau null
 */
async function findProductFromTranscript(transcript) {
  if (!transcript) return null;

  const allProducts = await prisma.product.findMany({
    select: { id: true, name: true, price: true },
  });
  if (!allProducts.length) return null;

  const transNorm = normalize(transcript);
  const transWords = new Set(transNorm.split(/\s+/));

  let bestMatch = null;
  let bestOverlap = 0;
  for (const prod of allProducts) {
    const prodNorm = normalize(prod.name);
    const prodWords = new Set(prodNorm.split(/\s+/));
    const overlap = [...transWords].filter((w) => prodWords.has(w)).length;
    if (overlap > bestOverlap) {
      bestOverlap = overlap;
      bestMatch = prod;
    }
  }
  return bestOverlap >= 1 ? bestMatch : null;
}

exports.processVoice = async (req, res) => {
  let audioFilePath = null;
  try {
    const audioFile = req.file;
    if (!audioFile) {
      return res
        .status(400)
        .json({ success: false, message: 'No audio file uploaded' });
    }

    audioFilePath = audioFile.path;

    // Kirim ke FastAPI endpoint /predict (sesuai README)
    const form = new FormData();
    form.append('audio', fs.createReadStream(audioFilePath), {
      filename: 'recording.wav',
      contentType: 'audio/wav',
    });

    const fastApiUrl =
      process.env.AI_SERVICE_URL || 'http://localhost:8000/predict';
    console.log(`[Voice] Calling FastAPI: ${fastApiUrl}`);

    const fastApiResponse = await axios.post(fastApiUrl, form, {
      headers: form.getHeaders(),
      timeout: 30000,
    });

    // Hapus file temporary
    if (audioFilePath && fs.existsSync(audioFilePath))
      fs.unlinkSync(audioFilePath);

    // Data dari FastAPI (berdasarkan README)
    const { jumlah, harga, jumlah_confidence } = fastApiResponse.data;

    // Cari produk terdekat berdasarkan harga prediksi
    const userId = req.userId;
    const products = await prisma.product.findMany({
      where: { user_id: userId },
      select: { id: true, name: true, price: true },
    });

    let matchedProduct = null;
    let minDiff = Infinity;
    for (const p of products) {
      const diff = Math.abs(p.price - harga);
      if (diff < minDiff) {
        minDiff = diff;
        matchedProduct = p;
      }
    }

    res.json({
      success: true,
      jumlah,
      harga,
      jumlah_confidence,
      matchedProduct: matchedProduct
        ? {
            id: matchedProduct.id,
            name: matchedProduct.name,
            price: matchedProduct.price,
          }
        : null,
      produk: matchedProduct?.name || 'Tidak diketahui',
    });
  } catch (error) {
    console.error('[Voice] Error:', error.message);
    if (audioFilePath && fs.existsSync(audioFilePath))
      fs.unlinkSync(audioFilePath);
    res
      .status(500)
      .json({
        success: false,
        message: 'Failed to process voice',
        detail: error.message,
      });
  }
};
