const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const prisma = require('../config/prisma');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const { PassThrough } = require('stream');

ffmpeg.setFfmpegPath(ffmpegPath);

// Helper: normalisasi string
const normalize = (str) =>
  String(str || '')
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .trim();

/**
 * Konversi buffer audio ke WAV (16kHz, mono)
 */
async function convertToWavBuffer(inputBuffer, inputFormat = 'webm') {
  return new Promise((resolve, reject) => {
    const inputStream = new PassThrough();
    inputStream.end(inputBuffer);

    const chunks = [];
    const command = ffmpeg(inputStream)
      .inputFormat(inputFormat)
      .audioFrequency(16000)
      .audioChannels(1)
      .format('wav');

    command.on('error', (err) => {
      reject(err);
    });

    const outputStream = command.pipe();
    outputStream.on('data', (chunk) => chunks.push(chunk));
    outputStream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

/**
 * Mencari produk berdasarkan prediksi dan alternatif top3
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

  // Exact match
  for (const prod of allProducts) {
    const normalizedProd = normalize(prod.name);
    if (normalizedProd === normalizedPredicted) return prod;
    if (normalizedAlternatives.includes(normalizedProd)) return prod;
  }

  // Partial match (overlap kata)
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
 * Fallback pencarian dari transkrip jika confidence rendah
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
    const transcript = req.body.transcript || '';
    let jumlah = parseInt(req.body.jumlah) || 0;

    if (!audioFile) {
      return res
        .status(400)
        .json({ success: false, message: 'No audio file uploaded' });
    }

    // Baca buffer audio dari file yang di-upload (multer simpan di memory)
    let audioBuffer = audioFile.buffer;
    let originalName = audioFile.originalname || 'recording.webm';
    let isWav = originalName.toLowerCase().endsWith('.wav');

    // Jika bukan WAV, konversi ke WAV (16kHz, mono)
    if (!isWav) {
      try {
        const inputFormat = originalName.split('.').pop();
        audioBuffer = await convertToWavBuffer(audioBuffer, inputFormat);
        originalName = 'converted.wav';
        console.log('Audio berhasil dikonversi ke WAV');
      } catch (convErr) {
        console.warn(
          'Konversi gagal, menggunakan audio asli:',
          convErr.message,
        );
        // Lanjutkan dengan audio asli, FastAPI mungkin tetap bisa memproses
      }
    }

    // Simpan sementara ke file jika perlu (opsional, untuk debug)
    // const tempPath = `temp_${Date.now()}.wav`;
    // fs.writeFileSync(tempPath, audioBuffer);
    // audioFilePath = tempPath;

    // Siapkan FormData untuk FastAPI
    const form = new FormData();
    form.append('audio', audioBuffer, {
      filename: originalName,
      contentType: 'audio/wav',
    });
    form.append('transcript', transcript);
    if (jumlah > 0) form.append('jumlah', String(jumlah));

    const fastApiUrl =
      process.env.AI_SERVICE_URL || 'http://localhost:8000/voice';
    console.log(`[Voice] Calling FastAPI: ${fastApiUrl}`);

    const fastApiResponse = await axios.post(fastApiUrl, form, {
      headers: { ...form.getHeaders() },
      timeout: 60000,
    });

    // Hapus file temporary jika ada
    if (audioFilePath && fs.existsSync(audioFilePath)) {
      fs.unlinkSync(audioFilePath);
    }

    // Data dari FastAPI
    const {
      produk = '',
      produk_conf = 0,
      produk_top3 = [],
      jumlah: qty,
      unit_price = 0,
      harga: hargaTotal,
    } = fastApiResponse.data;

    const finalJumlah = qty || jumlah || 1;
    const finalHarga = hargaTotal || unit_price * finalJumlah;

    // Cari produk di database
    let matchedProduct = await findProductByPrediction(produk, produk_top3);
    let usedFallback = false;
    let finalProductName = produk;

    // Jika confidence rendah (<70%) atau produk tidak ditemukan, fallback dari transkrip
    if (produk_conf < 0.7 || !matchedProduct) {
      const fallbackProduct = await findProductFromTranscript(transcript);
      if (fallbackProduct) {
        finalProductName = fallbackProduct.name;
        matchedProduct = fallbackProduct;
        usedFallback = true;
        console.log(
          `[Voice] Fallback digunakan: transcript → ${finalProductName}`,
        );
      }
    }

    res.json({
      success: true,
      produk: finalProductName,
      produk_conf: produk_conf,
      produk_top3: produk_top3,
      jumlah: finalJumlah,
      harga: finalHarga,
      matchedProduct: matchedProduct
        ? {
            id: matchedProduct.id,
            name: matchedProduct.name,
            price: matchedProduct.price,
          }
        : null,
      usedFallback,
    });

    console.log('[Voice] Proses berhasil:', {
      produk: finalProductName,
      jumlah: finalJumlah,
      harga: finalHarga,
      matchedProduct: matchedProduct ? matchedProduct.name : 'No match',
      usedFallback,
      confidence: produk_conf,
    });
  } catch (error) {
    console.error('[Voice] Error:', error.message);
    if (error.response) {
      console.error('[Voice] FastAPI response error:', error.response.data);
    }

    if (audioFilePath && fs.existsSync(audioFilePath)) {
      try {
        fs.unlinkSync(audioFilePath);
      } catch (e) {}
    }

    res.status(500).json({
      success: false,
      message: 'Failed to process voice',
      detail: error.message,
    });
  }
};
