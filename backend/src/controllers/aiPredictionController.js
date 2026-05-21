const axios = require('axios');
const prisma = require('../config/prisma');

const AI_PRED_URL = process.env.AI_PRED_URL || 'http://localhost:8001';

// ---------- Helper: Get last 7 days revenue data (for AI) ----------
async function getLast7DaysRevenue(userId) {
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6);
  startDate.setHours(0, 0, 0, 0);

  // Get all income transactions in the period
  const transactions = await prisma.transaction.findMany({
    where: {
      user_id: userId,
      type: 'income',
      transaction_date: { gte: startDate, lte: endDate },
    },
    select: {
      amount: true,
      transaction_date: true,
      items: true, // assuming items is JSON or has quantity
    },
  });

  // Build daily map
  const daily = {};
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const key = currentDate.toISOString().split('T')[0];
    daily[key] = {
      Revenue: 0,
      TxCount: 0,
      TotalUnits: 0,
      AvgUnitPrice: 0,
    };
    currentDate.setDate(currentDate.getDate() + 1);
  }

  for (const tx of transactions) {
    const key = tx.transaction_date.toISOString().split('T')[0];
    if (daily[key]) {
      daily[key].Revenue += tx.amount;
      daily[key].TxCount += 1;
      // Calculate total units sold: sum of item quantities
      let units = 0;
      if (Array.isArray(tx.items)) {
        units = tx.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
      }
      daily[key].TotalUnits += units;
    }
  }

  // Calculate AvgUnitPrice per day
  for (const key in daily) {
    const day = daily[key];
    day.AvgUnitPrice = day.TxCount > 0 ? day.Revenue / day.TxCount : 0;
  }

  // Convert to sorted array (oldest first)
  const last7 = Object.keys(daily)
    .sort()
    .map((date) => ({
      date,
      Revenue: daily[date].Revenue,
      TxCount: daily[date].TxCount,
      TotalUnits: daily[date].TotalUnits,
      AvgUnitPrice: daily[date].AvgUnitPrice,
    }));

  return last7;
}

// ---------- Helper: Get today's features for top products ----------
async function getTodayFeatures(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const threeDaysAgo = new Date(today);
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  // Get transactions
  const [todayTx, yesterdayTx, twoDaysTx, threeDaysTx] = await Promise.all([
    prisma.transaction.aggregate({
      where: {
        user_id: userId,
        type: 'income',
        transaction_date: {
          gte: today,
          lt: new Date(today.getTime() + 86400000),
        },
      },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.transaction.aggregate({
      where: {
        user_id: userId,
        type: 'income',
        transaction_date: { gte: yesterday, lt: today },
      },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.transaction.aggregate({
      where: {
        user_id: userId,
        type: 'income',
        transaction_date: { gte: twoDaysAgo, lt: yesterday },
      },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.transaction.aggregate({
      where: {
        user_id: userId,
        type: 'income',
        transaction_date: { gte: threeDaysAgo, lt: twoDaysAgo },
      },
      _sum: { amount: true },
      _count: true,
    }),
  ]);

  // Get total units sold today (from transaction items)
  const todayTransactions = await prisma.transaction.findMany({
    where: {
      user_id: userId,
      type: 'income',
      transaction_date: {
        gte: today,
        lt: new Date(today.getTime() + 86400000),
      },
    },
    select: { items: true },
  });
  let todayUnits = 0;
  for (const tx of todayTransactions) {
    if (Array.isArray(tx.items)) {
      todayUnits += tx.items.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0,
      );
    }
  }

  // Units yesterday
  const yesterdayTransactions = await prisma.transaction.findMany({
    where: {
      user_id: userId,
      type: 'income',
      transaction_date: { gte: yesterday, lt: today },
    },
    select: { items: true },
  });
  let yesterdayUnits = 0;
  for (const tx of yesterdayTransactions) {
    if (Array.isArray(tx.items)) {
      yesterdayUnits += tx.items.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0,
      );
    }
  }

  const todayRev = todayTx._sum.amount || 0;
  const yesterdayRev = yesterdayTx._sum.amount || 0;
  const twoDaysRev = twoDaysTx._sum.amount || 0;
  const threeDaysRev = threeDaysTx._sum.amount || 0;

  const revMA3 = (todayRev + yesterdayRev + twoDaysRev) / 3;

  return {
    TotalRevenue: todayRev,
    TotalUnits: todayUnits,
    TxCount: todayTx._count || 0,
    DayOfWeek: today.getDay(),
    IsWeekend: today.getDay() === 0 || today.getDay() === 6 ? 1 : 0,
    DayOfMonth: today.getDate(),
    Month: today.getMonth() + 1,
    RevLag1: yesterdayRev,
    RevLag2: twoDaysRev,
    UnitsLag1: yesterdayUnits,
    RevMA3: revMA3,
  };
}

// ---------- Helper: Get last 7 days stock data for a product ----------
async function getLast7DaysStock(userId, productId) {
  const product = await prisma.product.findFirst({
    where: { id: productId, user_id: userId },
  });
  if (!product) throw new Error('Product not found');

  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6);
  startDate.setHours(0, 0, 0, 0);

  // Build daily map
  const daily = {};
  let current = new Date(startDate);
  while (current <= endDate) {
    const key = current.toISOString().split('T')[0];
    daily[key] = {
      Units_Sold: 0,
      Stock_Out: 0,
      Stock_In: 0,
      DayOfWeek: current.getDay(),
      DayOfMonth: current.getDate(),
      Month: current.getMonth() + 1,
    };
    current.setDate(current.getDate() + 1);
  }

  // Fetch transactions (sales) – handle case where items structure differs
  const transactions = await prisma.transaction.findMany({
    where: {
      user_id: userId,
      type: 'income',
      transaction_date: { gte: startDate, lte: endDate },
    },
    select: { transaction_date: true, items: true },
  });

  for (const tx of transactions) {
    const dateKey = tx.transaction_date.toISOString().split('T')[0];
    if (daily[dateKey] && Array.isArray(tx.items)) {
      // Try to find product by various possible field names
      const item = tx.items.find(
        (i) =>
          i.productId === productId ||
          i.product_id === productId ||
          i.id === productId,
      );
      if (item && item.quantity) {
        const qty = item.quantity;
        daily[dateKey].Units_Sold += qty;
        daily[dateKey].Stock_Out += qty;
      }
    }
  }

  // Fetch stock logs if table exists, otherwise ignore
  let stockLogs = [];
  try {
    stockLogs = await prisma.stockLog.findMany({
      where: {
        product_id: productId,
        created_at: { gte: startDate, lte: endDate },
      },
      select: { quantity: true, created_at: true, type: true },
    });
  } catch (e) {
    console.log('[stock] StockLog table not available, skipping');
  }

  for (const log of stockLogs) {
    const dateKey = log.created_at.toISOString().split('T')[0];
    if (daily[dateKey]) {
      if (log.type === 'in' || log.quantity > 0) {
        daily[dateKey].Stock_In += log.quantity;
      } else if (log.type === 'out' && log.quantity < 0) {
        daily[dateKey].Stock_Out += Math.abs(log.quantity);
      }
    }
  }

  // Compute Stock_End running total
  const sortedKeys = Object.keys(daily).sort();
  let totalNetChange = 0;
  for (const key of sortedKeys) {
    totalNetChange += daily[key].Stock_In - daily[key].Stock_Out;
  }
  let runningStock = product.stock - totalNetChange;
  const result = [];
  for (const key of sortedKeys) {
    runningStock += daily[key].Stock_In - daily[key].Stock_Out;
    result.push({
      Units_Sold: daily[key].Units_Sold,
      Stock_Out: daily[key].Stock_Out,
      Stock_In: daily[key].Stock_In,
      DayOfWeek: daily[key].DayOfWeek,
      DayOfMonth: daily[key].DayOfMonth,
      Month: daily[key].Month,
      Stock_End: Math.max(0, runningStock),
    });
  }
  return result;
}

// ---------- Controllers ----------

exports.predictRevenue = async (req, res) => {
  try {
    const userId = req.userId;
    const last7 = await getLast7DaysRevenue(userId);
    const response = await axios.post(`${AI_PRED_URL}/predict-revenue`, {
      last_7_days: last7,
    });
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.predictTopProducts = async (req, res) => {
  try {
    const userId = req.userId;
    const features = await getTodayFeatures(userId);
    const response = await axios.post(`${AI_PRED_URL}/predict-top-products`, {
      today_features: features,
    });
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.predictStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.userId;

    console.log(`[stock] productId: ${productId}, userId: ${userId}`);

    // 1. Get product from database
    const product = await prisma.product.findFirst({
      where: { id: productId, user_id: userId },
    });
    if (!product) {
      console.log('[stock] Product not found in DB');
      return res.status(404).json({ error: 'Product not found' });
    }
    console.log(
      `[stock] product name: "${product.name}", current stock: ${product.stock}`,
    );

    // 2. Get last 7 days stock data
    let last7 = [];
    try {
      last7 = await getLast7DaysStock(userId, productId);
      console.log(`[stock] last7 data length: ${last7?.length}`);
    } catch (err) {
      console.error('[stock] Error fetching stock history:', err.message);
      // Fallback: generate minimal 7-day data from current stock only
      last7 = generateMinimalStockData(product.stock);
    }

    // 3. Validate we have at least some data (even if all zeros)
    if (!last7 || last7.length === 0) {
      console.log('[stock] No stock data, using fallback');
      last7 = generateMinimalStockData(product.stock);
    }

    // 4. Check if the data is "real enough" (not all zero sales and same stock)
    // 4. Check if the data is "real enough" (not all zero sales and same stock)
    const hasRealSales = last7.some((d) => d.Units_Sold > 0);
    const hasStockChanges = last7.some((d) => d.Stock_End !== product.stock);

    // TAMBAHKAN: jika stok <= min_stock atau stok = 0, paksa need_restock = true
    const isStockCriticallyLow =
      product.stock <= product.min_stock || product.stock === 0;

    if ((!hasRealSales && !hasStockChanges) || isStockCriticallyLow) {
      console.log(`[stock] AI unknown product: "${product.name}"`);
      return res.json({
        product_name: product.name,
        need_restock: true, // ← paksa true
        probability: 1.0, // probabilitas tinggi
        current_stock: product.stock,
        restock_threshold: product.min_stock || 100,
        note: 'Stok kritis, segera restok meskipun data historis kurang',
      });
    }
    if (isLowStock) {
      console.log(
        '[stock] Low stock detected, forcing AI call even with limited history',
      );
    }

    // 5. Call AI service
    let aiResponse;
    try {
      aiResponse = await axios.post(`${AI_PRED_URL}/predict-stock`, {
        product_name: product.name,
        last_7_days_stock: last7,
      });
    } catch (aiErr) {
      // If AI returns 404 (product unknown) or other error, return graceful fallback
      if (aiErr.response && aiErr.response.status === 404) {
        console.log(`[stock] AI unknown product: "${product.name}"`);
        // TAMBAHKAN: jika stok <= min_stock, paksa restok
        if (product.stock <= product.min_stock || product.stock === 0) {
          return res.json({
            product_name: product.name,
            need_restock: true,
            probability: 1.0,
            current_stock: product.stock,
            restock_threshold: product.min_stock || 100,
            note: 'Produk tidak dikenal AI, tapi stok kritis → wajib restok',
          });
        }
        return res.json({
          product_name: product.name,
          need_restock: false,
          probability: 0,
          current_stock: product.stock,
          restock_threshold: 100,
          note: 'Product not recognized by AI model',
        });
      }
      // Other AI errors (network, timeout, etc.)
      console.error('[stock] AI service error:', aiErr.message);
      throw aiErr; // rethrow to be caught by outer catch
    }

    // 6. Return AI result
    res.json(aiResponse.data);
  } catch (err) {
    console.error('[stock] ERROR:', err);
    res.status(500).json({
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  }
};

// Helper to generate minimal 7-day stock data when no history exists
function generateMinimalStockData(currentStock) {
  const today = new Date();
  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    last7.push({
      Units_Sold: 0,
      Stock_Out: 0,
      Stock_In: 0,
      DayOfWeek: date.getDay(),
      DayOfMonth: date.getDate(),
      Month: date.getMonth() + 1,
      Stock_End: currentStock,
    });
  }
  return last7;
}
