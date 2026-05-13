const prisma = require('../config/prisma');

// GET /transactions
exports.getTransactions = async (req, res) => {
  try {
    const userId = req.userId;
    const { startDate, endDate, category, type } = req.query;
    let where = { user_id: userId };
    if (startDate) where.transaction_date = { gte: new Date(startDate) };
    if (endDate)
      where.transaction_date = {
        ...where.transaction_date,
        lte: new Date(endDate),
      };
    if (category) where.category_id = parseInt(category);
    if (type) where.type = type;
    const transactions = await prisma.transaction.findMany({
      where,
      include: { category: true },
      orderBy: { transaction_date: 'desc' },
    });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /transactions/:id
exports.getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const transaction = await prisma.transaction.findFirst({
      where: { id, user_id: userId },
      include: { category: true },
    });
    if (!transaction)
      return res.status(404).json({ error: 'Transaction not found' });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /transactions
exports.createTransaction = async (req, res) => {
  try {
    const userId = req.userId;
    const { category_id, type, amount, description, transaction_date, source } =
      req.body;
    if (!category_id || !type || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const transaction = await prisma.transaction.create({
      data: {
        user_id: userId,
        category_id: parseInt(category_id),
        type,
        amount: parseFloat(amount),
        description,
        transaction_date: transaction_date
          ? new Date(transaction_date)
          : new Date(),
        source: source || 'manual',
      },
    });
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /transactions/:id
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { category_id, type, amount, description, transaction_date, source } =
      req.body;
    const existing = await prisma.transaction.findFirst({
      where: { id, user_id: userId },
    });
    if (!existing)
      return res.status(404).json({ error: 'Transaction not found' });
    const updated = await prisma.transaction.update({
      where: { id },
      data: {
        category_id: category_id ? parseInt(category_id) : undefined,
        type: type || undefined,
        amount: amount ? parseFloat(amount) : undefined,
        description,
        transaction_date: transaction_date
          ? new Date(transaction_date)
          : undefined,
        source: source || undefined,
      },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /transactions/:id
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const existing = await prisma.transaction.findFirst({
      where: { id, user_id: userId },
    });
    if (!existing)
      return res.status(404).json({ error: 'Transaction not found' });
    await prisma.transaction.delete({ where: { id } });
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
