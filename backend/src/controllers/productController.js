const prisma = require('../config/prisma');

exports.getProducts = async (req, res) => {
  try {
    const userId = req.userId;
    const products = await prisma.product.findMany({
      where: { user_id: userId },
      orderBy: { name: 'asc' },
    });
    // Tambahkan status menipis
    const productsWithStatus = products.map((p) => ({
      ...p,
      status: p.stock < p.min_stock ? 'Menipis' : 'Aman',
    }));
    res.json(productsWithStatus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, sku, stock, unit, price, min_stock } = req.body;
    const product = await prisma.product.create({
      // now prisma is defined
      data: {
        user_id: req.userId,
        name,
        sku,
        stock: stock || 0,
        unit,
        price: price ? parseFloat(price) : null,
        min_stock: min_stock || 10,
      },
    });
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { name, sku, stock, unit, price, min_stock } = req.body;

    const existing = await prisma.product.findFirst({
      where: { id, user_id: userId },
    });
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: name || undefined,
        sku: sku !== undefined ? sku : undefined,
        stock: stock !== undefined ? parseInt(stock) : undefined,
        unit: unit !== undefined ? unit : undefined,
        price: price !== undefined ? parseFloat(price) : undefined,
        min_stock: min_stock !== undefined ? parseInt(min_stock) : undefined,
      },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const existing = await prisma.product.findFirst({
      where: { id, user_id: userId },
    });
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
