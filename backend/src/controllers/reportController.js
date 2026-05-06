const prisma = require('../config/prisma');

// 1. Tren pengeluaran bulanan (per hari) - RQ1
exports.getMonthlyExpenseTrend = async (req, res) => {
  try {
    const { year, month } = req.query;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const transactions = await prisma.transaction.findMany({
      where: {
        user_id: req.userId,
        type: 'expense',
        transaction_date: { gte: startDate, lte: endDate },
      },
      select: { amount: true, transaction_date: true },
    });
    const daily = {};
    for (let i = 1; i <= endDate.getDate(); i++) daily[i] = 0;
    transactions.forEach((t) => {
      const day = t.transaction_date.getDate();
      daily[day] += t.amount;
    });
    // Deteksi periode defisit anggaran (misal jika cumulative melebihi pemasukan)
    // Untuk sederhana, kita kembalikan daily spending
    res.json({ year, month, daily });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Korelasi kategori terhadap kegagalan target tabungan - RQ2
// Asumsi: bandingkan pengeluaran per kategori dengan status goal (failed/active)
exports.getCategoryCorrelation = async (req, res) => {
  try {
    // Ambil semua transaksi expense user
    const expenses = await prisma.transaction.groupBy({
      by: ['category_id'],
      where: { user_id: req.userId, type: 'expense' },
      _sum: { amount: true },
    });
    const categoryIds = expenses.map((e) => e.category_id);
    const categories = await prisma.transactionCategory.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true },
    });
    // Ambil status goals (active/failed)
    const goals = await prisma.financialGoal.findMany({
      where: { user_id: req.userId },
    });
    const hasFailed = goals.some((g) => g.status === 'failed');
    // Sederhana: jika ada goal gagal, tampilkan kategori terbesar, dll.
    // Tapi untuk jawab RQ2, kita kembalikan total per kategori
    const result = expenses.map((e) => ({
      category_id: e.category_id,
      category_name: categories.find((c) => c.id === e.category_id)?.name,
      total_expense: e._sum.amount,
    }));
    res.json({ user_has_failed_goal: hasFailed, categories: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Anomali pengeluaran (flag dari AI) - RQ3
exports.getAnomalyInsights = async (req, res) => {
  try {
    const anomalies = await prisma.anomalyDetection.findMany({
      where: { user_id: req.userId },
      include: { transaction: true },
      orderBy: { detected_at: 'desc' },
    });
    res.json(anomalies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Summary bulanan (total income, expense, net)
exports.getMonthlySummary = async (req, res) => {
  try {
    const { year, month } = req.query;
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    const income = await prisma.transaction.aggregate({
      where: {
        user_id: req.userId,
        type: 'income',
        transaction_date: { gte: start, lte: end },
      },
      _sum: { amount: true },
    });
    const expense = await prisma.transaction.aggregate({
      where: {
        user_id: req.userId,
        type: 'expense',
        transaction_date: { gte: start, lte: end },
      },
      _sum: { amount: true },
    });
    res.json({
      year,
      month,
      total_income: income._sum.amount || 0,
      total_expense: expense._sum.amount || 0,
      net_balance: (income._sum.amount || 0) - (expense._sum.amount || 0),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Generate financial report untuk periode tertentu
exports.generateFinancialReport = async (req, res) => {
  try {
    const { year, month } = req.body;
    if (!year || !month) {
      return res.status(400).json({ error: 'year and month required' });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const userId = req.userId;

    // Hitung total income
    const incomeAgg = await prisma.transaction.aggregate({
      where: {
        user_id: userId,
        type: 'income',
        transaction_date: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
    });

    // Hitung total expense
    const expenseAgg = await prisma.transaction.aggregate({
      where: {
        user_id: userId,
        type: 'expense',
        transaction_date: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
    });

    const totalIncome = incomeAgg._sum.amount || 0;
    const totalExpense = expenseAgg._sum.amount || 0;
    const netBalance = totalIncome - totalExpense;

    // Upsert ke financial_reports (hapus constraint unique jika perlu)
    let report;
    try {
      report = await prisma.financialReport.upsert({
        where: {
          // Prisma akan menggunakan unique constraint yang ada
          // Jika belum ada, cukup buat baru
          id: 'dummy', // tidak akan dipakai
        },
        update: {
          total_income: totalIncome,
          total_expense: totalExpense,
          net_balance: netBalance,
          period_end: endDate,
        },
        create: {
          user_id: userId,
          period_type: 'monthly',
          period_start: startDate,
          period_end: endDate,
          total_income: totalIncome,
          total_expense: totalExpense,
          net_balance: netBalance,
        },
      });
    } catch (err) {
      // Jika upsert gagal karena unique key, coba create saja
      // Atau hapus report lama lalu buat baru
      const existing = await prisma.financialReport.findFirst({
        where: {
          user_id: userId,
          period_type: 'monthly',
          period_start: startDate,
          period_end: endDate,
        },
      });
      if (existing) {
        report = await prisma.financialReport.update({
          where: { id: existing.id },
          data: {
            total_income: totalIncome,
            total_expense: totalExpense,
            net_balance: netBalance,
          },
        });
      } else {
        report = await prisma.financialReport.create({
          data: {
            user_id: userId,
            period_type: 'monthly',
            period_start: startDate,
            period_end: endDate,
            total_income: totalIncome,
            total_expense: totalExpense,
            net_balance: netBalance,
          },
        });
      }
    }

    res.json({ message: 'Report generated', report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
