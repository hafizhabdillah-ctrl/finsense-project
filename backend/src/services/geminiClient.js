// const { GoogleGenerativeAI } = require('@google/generative-ai');

// // Gunakan model yang lebih stabil: gemini-pro
// const MODEL_NAME = 'gemini-pro';

// async function chatWithAI(prompt, context = '') {
//   try {
//     const apiKey = process.env.GEMINI_API_KEY;
//     if (!apiKey) {
//       console.error('GEMINI_API_KEY tidak diset di environment');
//       return 'Maaf, layanan AI sedang tidak tersedia. Silakan coba lagi nanti.';
//     }

//     const genAI = new GoogleGenerativeAI(apiKey);
//     const model = genAI.getGenerativeModel({ model: MODEL_NAME });

//     const fullPrompt = context
//       ? `Konteks percakapan sebelumnya:\n${context}\n\nPertanyaan pengguna: ${prompt}\n\nJawablah sebagai asisten keuangan UMKM yang ramah dan informatif.`
//       : `Anda adalah asisten keuangan untuk UMKM. Pertanyaan: ${prompt}`;

//     const result = await model.generateContent(fullPrompt);
//     const response = await result.response;
//     const text = response.text();
//     return text;
//   } catch (error) {
//     console.error('Gemini error:', error);
//     // Fallback response yang ramah
//     return 'Maaf, saya sedang mengalami gangguan teknis. Tim kami akan segera memperbaiki. Sementara, Anda bisa bertanya lagi nanti atau hubungi dukungan.';
//   }
// }

// module.exports = { chatWithAI };

// tanpa API Gemini, dummy function dulu untuk development Menggunakan mock response karena API key mungkin terbatas

async function chatWithAI(prompt, context = '') {
  console.log(`[AI Chat] Prompt: ${prompt}`);

  // Mock response yang relevan dengan keuangan UMKM
  const lowerPrompt = prompt.toLowerCase();

  if (
    lowerPrompt.includes('pisahkan keuangan') ||
    lowerPrompt.includes('pribadi')
  ) {
    return '📌 Tips memisahkan keuangan pribadi dan usaha:\n\n1. Buka rekening bank khusus untuk usaha\n2. Catat semua transaksi usaha secara terpisah\n3. Tetapkan gaji tetap untuk diri sendiri dari usaha\n4. Hindari menggunakan uang usaha untuk keperluan pribadi\n5. Gunakan aplikasi FinSense untuk memantau arus kas usaha Anda.';
  }

  if (lowerPrompt.includes('hemat') || lowerPrompt.includes('pengeluaran')) {
    return '💡 Tips menghemat pengeluaran UMKM:\n\n• Catat semua pengeluaran rutin\n• Buat anggaran per kategori (bahan baku, operasional, dll)\n• Bandingkan harga dari beberapa supplier\n• Kurangi pembelian impulsif\n• Evaluasi pengeluaran setiap minggu di FinSense';
  }

  if (
    lowerPrompt.includes('target') ||
    lowerPrompt.includes('nabung') ||
    lowerPrompt.includes('tabungan')
  ) {
    return '🎯 Untuk mencapai target tabungan:\n\n• Tetapkan target yang realistis (misal: 10-20% dari pendapatan)\n• Otomatiskan transfer ke rekening tabungan\n• Pantau progress target di fitur Financial Goals FinSense\n• Evaluasi pengeluaran yang tidak perlu setiap bulan';
  }

  if (lowerPrompt.includes('modal') || lowerPrompt.includes('usaha')) {
    return '💰 Manajemen modal usaha:\n\n• Pisahkan modal kerja dan modal tetap\n• Hitung break-even point usaha Anda\n• Hindari mengambil modal untuk kebutuhan konsumtif\n• Gunakan laporan keuangan di FinSense untuk melihat profitabilitas';
  }

  // Default response
  return 'Halo! Saya asisten keuangan UMKM FinSense. Saya bisa membantu Anda dengan:\n\n✅ Tips memisahkan keuangan pribadi & usaha\n✅ Cara menghemat pengeluaran\n✅ Strategi mencapai target tabungan\n✅ Manajemen modal usaha\n\nSilakan tanyakan hal spesifik tentang keuangan UMKM Anda!';
}

module.exports = { chatWithAI };
