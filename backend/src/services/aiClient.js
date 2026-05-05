const prisma = require('../config/prisma');

async function classifyText(text) {
  try {
    console.log(`[AI] classifyText called with: ${text}`);

    // Cari kategori 'Lainnya' (expense)
    let category = await prisma.transactionCategory.findFirst({
      where: { name: 'Lainnya', type: 'expense' },
    });

    if (!category) {
      // Fallback: ambil kategori expense pertama
      category = await prisma.transactionCategory.findFirst({
        where: { type: 'expense' },
      });
    }

    if (!category) {
      throw new Error('Tidak ada kategori expense di database');
    }

    // Sementara selalu kembalikan kategori default
    return { categoryId: category.id, confidence: 0.95 };
  } catch (error) {
    console.error('AI classify error:', error.message);
    // Fallback ke id 1 (asumsi 1 adalah Lainnya)
    return { categoryId: 1, confidence: 0.5 };
  }
}

module.exports = { classifyText };
