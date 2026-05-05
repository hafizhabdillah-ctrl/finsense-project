const prisma = require('../config/prisma');
const aiClient = require('../services/aiClient');

// Helper: dapatkan kategori default (Lainnya)
async function getDefaultCategoryId() {
  const defaultCat = await prisma.transactionCategory.findFirst({
    where: { name: 'Lainnya' },
  });
  if (!defaultCat) {
    // jika tidak ada, cari salah satu kategori expense
    const anyCat = await prisma.transactionCategory.findFirst({
      where: { type: 'expense' },
    });
    if (!anyCat) {
      throw new Error('Tidak ada kategori expense di database');
    }
    return anyCat.id;
  }
  return defaultCat.id;
}

exports.getTransactions = async (req, res) => {
  try {
    const { startDate, endDate, categoryId, type } = req.query;
    const where = { user_id: req.userId };
    if (startDate) where.transaction_date = { gte: new Date(startDate) };
    if (endDate)
      where.transaction_date = {
        ...where.transaction_date,
        lte: new Date(endDate),
      };
    if (categoryId) where.category_id = parseInt(categoryId);
    if (type) where.type = type;
    const transactions = await prisma.transaction.findMany({
      where,
      include: { items: true, category: true },
      orderBy: { transaction_date: 'desc' },
    });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE transaction (manual or voice)
exports.createTransaction = async (req, res) => {
  try {
    const userId = req.userId;
    let { amount, description, transaction_date, type, source, items } =
      req.body;

    // Validasi amount
    if (!amount || isNaN(parseFloat(amount))) {
      return res.status(400).json({ error: 'Amount harus berupa angka' });
    }

    let categoryId = null;

    if (description) {
      // Coba klasifikasi via AI
      const aiResult = await aiClient.classifyText(description);
      categoryId = aiResult.categoryId;

      // Validasi apakah categoryId ada di database
      const categoryExists = await prisma.transactionCategory.findUnique({
        where: { id: categoryId },
      });
      if (!categoryExists) {
        console.warn(
          `Category ID ${categoryId} dari AI tidak valid, pakai default`,
        );
        categoryId = await getDefaultCategoryId();
      }
    } else {
      // fallback kategori default
      categoryId = await getDefaultCategoryId();
    }

    // Pastikan categoryId final valid
    const finalCategory = await prisma.transactionCategory.findUnique({
      where: { id: categoryId },
    });
    if (!finalCategory) {
      return res.status(500).json({ error: 'Kategori tidak valid' });
    }

    // Siapkan data untuk create
    const transactionData = {
      user_id: userId,
      category_id: categoryId,
      amount: parseFloat(amount),
      description: description || null,
      transaction_date: transaction_date
        ? new Date(transaction_date)
        : new Date(),
      type: type,
      source: source || 'manual',
    };

    // Jika ada items, tambahkan relasi create
    if (items && items.length) {
      transactionData.items = {
        create: items.map((item) => ({
          item_name: item.item_name,
          quantity: item.quantity,
          unit: item.unit || null,
          unit_price: item.unit_price,
          total_price: item.quantity * item.unit_price,
          category_id: item.category_id || categoryId,
          ai_confidence: item.ai_confidence || null,
        })),
      };
    }

    const transaction = await prisma.transaction.create({
      data: transactionData,
      include: { items: true },
    });

    res.status(201).json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE transaction (and its items)
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { amount, description, transaction_date, type, source, items } =
      req.body;

    // Pastikan transaksi milik user
    const existing = await prisma.transaction.findFirst({
      where: { id, user_id: userId },
    });
    if (!existing) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Update transaction
    const updated = await prisma.transaction.update({
      where: { id },
      data: {
        amount: amount !== undefined ? parseFloat(amount) : undefined,
        description: description !== undefined ? description : undefined,
        transaction_date: transaction_date
          ? new Date(transaction_date)
          : undefined,
        type: type !== undefined ? type : undefined,
        source: source !== undefined ? source : undefined,
      },
    });

    // Jika ada items, replace semua items lama dengan yang baru
    if (items !== undefined) {
      // Hapus items lama
      await prisma.transactionItem.deleteMany({
        where: { transaction_id: id },
      });
      if (items.length > 0) {
        await prisma.transactionItem.createMany({
          data: items.map((item) => ({
            transaction_id: id,
            item_name: item.item_name,
            quantity: item.quantity,
            unit: item.unit || null,
            unit_price: item.unit_price,
            total_price: item.quantity * item.unit_price,
            category_id: item.category_id || existing.category_id,
            ai_confidence: item.ai_confidence || null,
          })),
        });
      }
    }

    // Ambil kembali data dengan include items
    const result = await prisma.transaction.findUnique({
      where: { id },
      include: { items: true },
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const existing = await prisma.transaction.findFirst({
      where: { id, user_id: userId },
    });
    if (!existing) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    await prisma.transaction.delete({ where: { id } });
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
