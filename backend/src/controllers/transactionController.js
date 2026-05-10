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

    // ========== 1. Validasi awal ==========
    if (!amount || isNaN(parseFloat(amount))) {
      return res.status(400).json({ error: 'Amount harus berupa angka' });
    }
    amount = parseFloat(amount);

    // Validasi type
    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'Type harus income atau expense' });
    }

    // Validasi items jika ada
    if (items && !Array.isArray(items)) {
      return res.status(400).json({ error: 'Items harus berupa array' });
    }

    if (items && items.length) {
      for (const item of items) {
        if (!item.item_name || typeof item.item_name !== 'string') {
          return res
            .status(400)
            .json({ error: 'Setiap item harus memiliki item_name' });
        }
        if (
          !item.quantity ||
          isNaN(parseFloat(item.quantity)) ||
          parseFloat(item.quantity) <= 0
        ) {
          return res
            .status(400)
            .json({ error: `Quantity item ${item.item_name} harus angka > 0` });
        }
        if (
          !item.unit_price ||
          isNaN(parseFloat(item.unit_price)) ||
          parseFloat(item.unit_price) < 0
        ) {
          return res.status(400).json({
            error: `Unit price item ${item.item_name} harus angka >= 0`,
          });
        }
        // Konversi ke number
        item.quantity = parseFloat(item.quantity);
        item.unit_price = parseFloat(item.unit_price);
      }
    }

    // Validasi transaction_date
    let transactionDate = transaction_date
      ? new Date(transaction_date)
      : new Date();
    if (isNaN(transactionDate.getTime())) {
      return res.status(400).json({ error: 'transaction_date tidak valid' });
    }

    // ========== 2. Tentukan kategori (AI atau default) ==========
    let categoryId = null;

    try {
      if (description && typeof description === 'string') {
        const aiResult = await aiClient.classifyText(description);
        categoryId = aiResult.categoryId;

        // Validasi apakah categoryId ada di DB
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
        categoryId = await getDefaultCategoryId();
      }
    } catch (aiError) {
      console.error('Gagal klasifikasi AI:', aiError.message);
      categoryId = await getDefaultCategoryId();
    }

    // Pastikan categoryId final valid (guard)
    const finalCategory = await prisma.transactionCategory.findUnique({
      where: { id: categoryId },
    });
    if (!finalCategory) {
      return res
        .status(500)
        .json({ error: 'Konfigurasi kategori default tidak valid' });
    }

    // ========== 3. Siapkan data transaksi ==========
    const transactionData = {
      user_id: userId,
      category_id: categoryId,
      amount: amount,
      description: description || null,
      transaction_date: transactionDate,
      type: type,
      source: source || 'manual',
    };

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

    // ========== 4. Jalankan dalam Prisma transaction ==========
    const result = await prisma.$transaction(async (tx) => {
      // 4a. Buat transaksi
      const transaction = await tx.transaction.create({
        data: transactionData,
        include: { items: true },
      });

      // 4b. Jika type income dan ada items yang memiliki product_id -> kurangi stok
      if (type === 'income' && items && items.length) {
        for (const item of items) {
          if (item.product_id) {
            const product = await tx.product.findFirst({
              where: { id: item.product_id, user_id: userId },
            });
            if (!product) {
              throw new Error(
                `Produk dengan ID ${item.product_id} tidak ditemukan untuk user ini`,
              );
            }
            const newStock = product.stock - item.quantity;
            if (newStock < 0) {
              throw new Error(
                `Stok produk ${product.name} tidak mencukupi (stok: ${product.stock}, permintaan: ${item.quantity})`,
              );
            }
            await tx.product.update({
              where: { id: item.product_id },
              data: { stock: newStock },
            });
            await tx.stockLog.create({
              data: {
                product_id: item.product_id,
                user_id: userId,
                type: 'out',
                quantity: -item.quantity, // negatif untuk pengurangan (bisa disesuaikan schema)
                note: `Penjualan via POS - transaksi ${transaction.id}`,
                operator: 'POS',
                status: 'completed',
              },
            });
          }
        }
      }

      return transaction;
    });

    res.status(201).json(result);
  } catch (err) {
    console.error('Create transaction error:', err);
    // Kirim pesan error yang jelas ke client
    res
      .status(500)
      .json({ error: err.message || 'Terjadi kesalahan pada server' });
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
