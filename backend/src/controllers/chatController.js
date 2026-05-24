const prisma = require('../config/prisma');
const axios = require('axios');

// Helper untuk mendapatkan quick replies berdasarkan state
function getQuickRepliesFromIntent(intent, currentState) {
  // Jika dalam state tertentu, kirim pilihan submenu
  if (currentState && currentState !== 'main') {
    // Misal state 'tips' -> kembalikan opsi submenu tips
    const subMenus = {
      tips: [
        { id: 'tips_hemat', label: '✅ Tips Hemat' },
        { id: 'tips_investasi', label: '💰 Tips Investasi' },
        { id: 'back', label: '🔙 Kembali' },
      ],
      laporan: [
        { id: 'laporan_harian', label: '📅 Harian' },
        { id: 'laporan_bulanan', label: '📆 Bulanan' },
        { id: 'back', label: '🔙 Kembali' },
      ],
    };
    return subMenus[currentState] || [];
  }

  // Menu utama (default)
  const mainMenu = [
    { id: 'tips', label: '💡 Tips Keuangan' },
    { id: 'laporan', label: '📊 Laporan' },
    { id: 'rekomendasi_usaha', label: '🚀 Rekomendasi Usaha' },
    { id: 'pajak_umkm', label: '📑 Pajak UMKM' },
  ];
  return mainMenu;
}

exports.sendMessage = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    const session = await prisma.aiChatSession.findFirst({
      where: { id: sessionId, user_id: req.userId },
    });
    if (!session) return res.status(404).json({ error: 'Session not found' });

    await prisma.aiMessage.create({
      data: { session_id: sessionId, role: 'user', content: message },
    });

    // ----- TAMBAHKAN KEYWORD MATCHING DI SINI (SEBELUM PANGGIL FASTAPI) -----
    const lowerMsg = message.toLowerCase();
    let replyText = null;
    let intent = null;

    if (
      lowerMsg.includes('tips') ||
      lowerMsg.includes('hemat') ||
      lowerMsg.includes('keuangan')
    ) {
      replyText =
        '💡 **Tips Keuangan UMKM:**\n1. Pisahkan rekening usaha dan pribadi\n2. Catat setiap pengeluaran sekecil apapun\n3. Beli bahan baku dalam jumlah besar (lebih hemat)\n4. Negosiasi dengan supplier secara rutin\n5. Sisihkan minimal 10% omzet untuk tabungan darurat.\n\nAda yang ingin ditanyakan lagi?';
      intent = 'tips_keuangan';
    } else if (
      lowerMsg.includes('laporan') ||
      lowerMsg.includes('bulanan') ||
      lowerMsg.includes('harian')
    ) {
      replyText =
        '📊 Untuk melihat laporan keuangan, buka menu **Laporan** di dashboard. Tersedia laporan harian, mingguan, dan bulanan.';
      intent = 'laporan';
    } else if (
      lowerMsg.includes('rekomendasi') ||
      lowerMsg.includes('usaha') ||
      lowerMsg.includes('bisnis')
    ) {
      replyText =
        '🌟 **Rekomendasi usaha:**\n- Manfaatkan media sosial untuk promosi gratis\n- Jual produk bundling (paket hemat)\n- Ikuti pelatihan UMKM gratis dari pemerintah';
      intent = 'rekomendasi';
    } else if (lowerMsg.includes('pajak')) {
      replyText =
        '📌 Pajak UMKM saat ini 0.5% dari omzet bulanan (PPH Final). Bayar via bank atau e-commerce paling lambat tanggal 15 setiap bulan.';
      intent = 'pajak';
    } else {
      // Jika tidak ada keyword match, baru panggil FastAPI
      try {
        const response = await axios.post('http://localhost:8002/predict', {
          text: message,
        });
        intent = response.data.intent;
      } catch (err) {
        console.error('FastAPI error:', err.message);
        intent = 'fallback';
      }

      // Mapping response berdasarkan intent dari model
      const responses = {
        greeting: 'Halo! Ada yang bisa saya bantu terkait keuangan UMKM?',
        tips_hemat:
          '💡 Tips hemat: 1. Catat pengeluaran kecil, 2. Beli bahan baku dalam jumlah besar, 3. Negosiasi supplier.',
        laporan_bulanan:
          '📊 Fitur laporan bulanan sedang dalam pengembangan. Ingin lihat laporan harian?',
        rekomendasi_usaha:
          '🌟 Rekomendasi: Coba jual produk bundling, atau manfaatkan media sosial.',
        investasi_modal:
          '💰 Pastikan cashflow positif 3 bulan sebelum investasi.',
        pajak_umkm: '📌 Pajak UMKM 0.5% dari omzet bulanan.',
        fallback: 'Maaf, saya belum mengerti. Silakan pilih menu di bawah.',
      };
      replyText = responses[intent] || responses.fallback;
    }

    // Simpan balasan AI
    const assistantMsg = await prisma.aiMessage.create({
      data: {
        session_id: sessionId,
        role: 'assistant',
        content: replyText,
        model_used: intent ? 'keyword-fallback' : 'custom-chatbot',
      },
    });

    // Update session
    await prisma.aiChatSession.update({
      where: { id: sessionId },
      data: {
        last_active_at: new Date(),
        message_count: { increment: 2 },
        context_summary: intent || 'main',
      },
    });

    // Quick replies (opsional: sesuaikan dengan intent yang terdeteksi)
    let quickReplies = [];
    if (intent === 'tips_keuangan') {
      quickReplies = [
        { id: 'tips_lanjutan', label: 'Tips lanjutan' },
        { id: 'back', label: '🔙 Kembali' },
      ];
    } else {
      quickReplies = [
        { id: 'tips', label: '💡 Tips Keuangan' },
        { id: 'laporan', label: '📊 Laporan' },
        { id: 'rekomendasi', label: '🚀 Rekomendasi' },
        { id: 'pajak', label: '📑 Pajak' },
      ];
    }

    res.json({
      assistantMessage: assistantMsg,
      quickReplies: quickReplies,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Get all chat sessions for logged-in user
exports.getSessions = async (req, res) => {
  try {
    const sessions = await prisma.aiChatSession.findMany({
      where: { user_id: req.userId },
      orderBy: { last_active_at: 'desc' },
    });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new session
exports.createSession = async (req, res) => {
  try {
    const { session_title } = req.body;
    const session = await prisma.aiChatSession.create({
      data: {
        user_id: req.userId,
        session_title: session_title || 'Chat baru',
      },
    });
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get messages in a session
exports.getMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const messages = await prisma.aiMessage.findMany({
      where: { session_id: sessionId },
      orderBy: { created_at: 'asc' },
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete session
exports.deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    await prisma.aiChatSession.delete({
      where: { id: sessionId, user_id: req.userId },
    });
    res.json({ message: 'Session deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
