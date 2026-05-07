const prisma = require('../config/prisma');

exports.getDebts = async (req, res) => {
  try {
    const userId = req.userId;
    const debts = await prisma.debt.findMany({
      where: { user_id: userId },
      include: { payments: true },
      orderBy: { due_date: 'asc' },
    });
    // Update status overdue jika melewati deadline
    const now = new Date();
    const updatedDebts = debts.map((d) => {
      if (d.status !== 'paid' && d.due_date < now) d.status = 'overdue';
      return d;
    });
    res.json(updatedDebts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createDebt = async (req, res) => {
  try {
    const userId = req.userId;
    const { customer_name, total_debt, due_date, note } = req.body;

    const debt = await prisma.debt.create({
      data: {
        user_id: userId,
        customer_name,
        total_debt: parseFloat(total_debt),
        due_date: new Date(due_date),
        note: note || null,
        status: 'pending',
      },
    });
    res.status(201).json(debt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.addPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { amount, note } = req.body;

    const debt = await prisma.debt.findFirst({
      where: { id, user_id: userId },
    });
    if (!debt) return res.status(404).json({ error: 'Debt not found' });
    if (debt.status === 'paid')
      return res.status(400).json({ error: 'Debt already paid' });

    const paymentAmount = parseFloat(amount);
    const newPaid = debt.paid_amount + paymentAmount;
    let newStatus = debt.status;
    if (newPaid >= debt.total_debt) {
      newStatus = 'paid';
    } else if (newPaid > 0) {
      newStatus = 'partial';
    }

    const result = await prisma.$transaction([
      prisma.debtPayment.create({
        data: {
          debt_id: id,
          amount: paymentAmount,
          note: note || null,
        },
      }),
      prisma.debt.update({
        where: { id },
        data: {
          paid_amount: newPaid,
          status: newStatus,
        },
      }),
    ]);
    res.json({
      message: 'Payment recorded',
      payment: result[0],
      debt: result[1],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteDebt = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const existing = await prisma.debt.findFirst({
      where: { id, user_id: userId },
    });
    if (!existing) return res.status(404).json({ error: 'Debt not found' });

    await prisma.debt.delete({ where: { id } });
    res.json({ message: 'Debt deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
