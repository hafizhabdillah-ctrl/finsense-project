const prisma = require('../config/prisma');

exports.getBudgets = async (req, res) => {
  try {
    const { year, month } = req.query;
    const where = { user_id: req.userId };
    if (year && month) {
      where.year = parseInt(year);
      where.month = parseInt(month);
    }
    const budgets = await prisma.monthlyBudget.findMany({
      where,
      include: { category: true },
    });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createOrUpdateBudget = async (req, res) => {
  try {
    const { category_id, month, year, budget_amount, alert_threshold } =
      req.body;
    const userId = req.userId;

    if (!category_id || !month || !year || !budget_amount) {
      return res
        .status(400)
        .json({ error: 'category_id, month, year, budget_amount required' });
    }

    const categoryExists = await prisma.transactionCategory.findUnique({
      where: { id: parseInt(category_id) },
    });
    if (!categoryExists) {
      return res
        .status(400)
        .json({ error: `Category with id ${category_id} not found` });
    }

    const existing = await prisma.monthlyBudget.findFirst({
      where: {
        user_id: userId,
        category_id: parseInt(category_id),
        month: parseInt(month),
        year: parseInt(year),
      },
    });

    let budget;
    if (existing) {
      budget = await prisma.monthlyBudget.update({
        where: { id: existing.id },
        data: {
          budget_amount: parseFloat(budget_amount),
          alert_threshold:
            alert_threshold !== undefined ? parseFloat(alert_threshold) : 80,
        },
      });
    } else {
      budget = await prisma.monthlyBudget.create({
        data: {
          user_id: userId,
          category_id: parseInt(category_id),
          month: parseInt(month),
          year: parseInt(year),
          budget_amount: parseFloat(budget_amount),
          alert_threshold:
            alert_threshold !== undefined ? parseFloat(alert_threshold) : 80,
        },
      });
    }
    res.json(budget);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const existing = await prisma.monthlyBudget.findFirst({
      where: { id, user_id: userId },
    });
    if (!existing) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    await prisma.monthlyBudget.delete({ where: { id } });
    res.json({ message: 'Budget deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
