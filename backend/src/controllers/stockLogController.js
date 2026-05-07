const prisma = require('../config/prisma');

exports.getStockLogs = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.query;
    const where = { user_id: userId };
    if (productId) where.product_id = productId;

    const logs = await prisma.stockLog.findMany({
      where,
      include: { product: true },
      orderBy: { created_at: 'desc' },
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createStockLog = async (req, res) => {
  try {
    const userId = req.userId;
    const { product_id, type, quantity, note, operator, status } = req.body;

    // Validasi product milik user
    const product = await prisma.product.findFirst({
      where: { id: product_id, user_id: userId },
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Hitung perubahan stok
    let stockChange = 0;
    if (type === 'in') stockChange = Math.abs(quantity);
    else if (type === 'out') stockChange = -Math.abs(quantity);
    else if (type === 'adjust') stockChange = quantity; // bisa positif/negatif

    // Update stok produk
    const newStock = product.stock + stockChange;
    await prisma.product.update({
      where: { id: product_id },
      data: { stock: newStock },
    });

    // Buat stock log
    const log = await prisma.stockLog.create({
      data: {
        product_id,
        user_id: userId,
        type,
        quantity: stockChange,
        note: note || null,
        operator: operator || 'admin',
        status: status || 'completed',
      },
    });
    res.status(201).json(log);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
