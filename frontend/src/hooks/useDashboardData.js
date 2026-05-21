import { useState, useEffect } from 'react';
import { getTransactions } from '../services/transactionService';
import { getProducts } from '../services/productService';
import api from '../services/api';

// ============================================================
// HELPER: Ambil riwayat stok 7 hari terakhir untuk suatu produk
// ============================================================
async function getStockHistory(productId, productName, currentStock) {
  const days = 7;
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (days - 1));
  startDate.setHours(0, 0, 0, 0);

  // Default history jika tidak ada data
  let history = [];

  try {
    // Coba ambil dari stock logs (type 'out' untuk penjualan, 'in' untuk restok)
    const response = await api.get('/stock-logs', {
      params: {
        product_id: productId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        _sort: 'created_at',
        _order: 'asc',
      },
    });
    const logs = response.data;

    // Siapkan data per hari
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
        Stock_End: currentStock,
      };
      current.setDate(current.getDate() + 1);
    }

    // Akumulasi dari logs
    for (const log of logs) {
      const dateKey = new Date(log.created_at).toISOString().split('T')[0];
      if (daily[dateKey]) {
        if (log.type === 'out') {
          daily[dateKey].Units_Sold += log.quantity;
          daily[dateKey].Stock_Out += log.quantity;
        } else if (log.type === 'in') {
          daily[dateKey].Stock_In += log.quantity;
        }
      }
    }

    // Hitung stok akhir per hari (running)
    const sortedKeys = Object.keys(daily).sort();
    let runningStock = currentStock;
    // Jika ada data, hitung mundur dari stok terakhir
    // Cara simpel: kita urutkan dari yang paling lama, stok awal tidak diketahui, kita asumsikan stok akhir hari ini sudah benar
    // Untuk menghindari negatif, kita hitung stok akhir dengan menjumlah dari awal
    // Kita butuh stok awal periode = currentStock - netChanges
    let totalNet = 0;
    for (const key of sortedKeys) {
      totalNet += daily[key].Stock_In - daily[key].Stock_Out;
    }
    let running = currentStock - totalNet;
    for (const key of sortedKeys) {
      running += daily[key].Stock_In - daily[key].Stock_Out;
      daily[key].Stock_End = Math.max(0, running);
    }

    history = sortedKeys.map((key) => ({
      Units_Sold: daily[key].Units_Sold,
      Stock_Out: daily[key].Stock_Out,
      Stock_In: daily[key].Stock_In,
      DayOfWeek: daily[key].DayOfWeek,
      DayOfMonth: daily[key].DayOfMonth,
      Month: daily[key].Month,
      Stock_End: daily[key].Stock_End,
    }));
  } catch (err) {
    console.warn(
      `Tidak bisa ambil stock logs untuk ${productName}, gunakan dummy`,
    );
  }

  // Jika history kurang dari 7 hari, pad dengan data terakhir
  if (history.length < days) {
    const lastEntry =
      history.length > 0
        ? history[history.length - 1]
        : {
            Units_Sold: 0,
            Stock_Out: 0,
            Stock_In: 0,
            DayOfWeek: 0,
            DayOfMonth: 1,
            Month: 1,
            Stock_End: currentStock,
          };
    while (history.length < days) {
      history.unshift({ ...lastEntry, Stock_End: currentStock });
    }
  }

  return history.slice(-days);
}

// ============================================================
// HOOK UTAMA
// ============================================================
export const useDashboardData = () => {
  const [todayIncome, setTodayIncome] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [averageOrder, setAverageOrder] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState([]); // produk stok <= min_stok (lokal)
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({ dates: [], amounts: [] });
  const [aiPredictions, setAiPredictions] = useState([]); // hasil AI untuk produk low stock
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Tanggal hari ini
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
        const endOfDay = new Date(
          today.setHours(23, 59, 59, 999),
        ).toISOString();

        // 2. Transaksi hari ini
        const todayRes = await getTransactions({
          startDate: startOfDay,
          endDate: endOfDay,
        });
        const todayIncomes = todayRes.data.filter((t) => t.type === 'income');
        const totalIncome = todayIncomes.reduce((s, t) => s + t.amount, 0);
        setTodayIncome(totalIncome);
        setTodayCount(todayIncomes.length);
        setAverageOrder(
          todayIncomes.length ? totalIncome / todayIncomes.length : 0,
        );

        // 3. Data untuk grafik (7 hari terakhir)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const weeklyRes = await getTransactions({
          startDate: sevenDaysAgo.toISOString(),
          endDate: endOfDay,
        });
        const weeklyIncomes = weeklyRes.data.filter((t) => t.type === 'income');
        const dailyMap = new Map();
        weeklyIncomes.forEach((t) => {
          const date = t.transaction_date.split('T')[0];
          dailyMap.set(date, (dailyMap.get(date) || 0) + t.amount);
        });
        const sortedDates = Array.from(dailyMap.keys()).sort();
        const amounts = sortedDates.map((d) => dailyMap.get(d));
        setChartData({ dates: sortedDates, amounts });

        // 4. Data produk
        const productsRes = await getProducts();
        const allProducts = productsRes.data;

        // 5. Low stock (stok <= min_stock)
        const lowStock = allProducts.filter((p) => p.stock <= p.min_stock);
        setLowStockProducts(lowStock.slice(0, 10));

        // 6. Best sellers dari stock log
        const stockLogsRes = await api.get('/stock-logs', {
          params: { type: 'out' },
        });
        const outLogs = stockLogsRes.data;
        const salesMap = new Map();
        outLogs.forEach((log) => {
          salesMap.set(
            log.product_id,
            (salesMap.get(log.product_id) || 0) + log.quantity,
          );
        });
        const bestIds = Array.from(salesMap.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([id]) => id);
        const topSellers = allProducts
          .filter((p) => bestIds.includes(p.id))
          .map((p) => ({ ...p, total_terjual: salesMap.get(p.id) }));
        setBestSellers(topSellers);

        // 7. PREDIKSI AI UNTUK PRODUK LOW STOCK (agar muncul di draft)
        setLoadingAi(true);
        const predictions = [];
        // Ambil maksimal 10 produk low stock (agar tidak overload)
        for (const product of lowStock.slice(0, 10)) {
          try {
            const stockHistory = await getStockHistory(
              product.id,
              product.name,
              product.stock,
            );
            const aiRes = await api.get(`/ai/predict-stock/${product.id}`);
            predictions.push({
              id: product.id,
              name: product.name,
              current_stock: product.stock,
              min_stock: product.min_stock,
              need_restock: aiRes.data.need_restock,
              probability: aiRes.data.probability,
              restock_threshold: aiRes.data.restock_threshold,
              note: aiRes.data.note || '',
            });
          } catch (err) {
            console.error(`AI error untuk ${product.name}`, err);
            predictions.push({
              id: product.id,
              name: product.name,
              current_stock: product.stock,
              min_stock: product.min_stock,
              need_restock: false,
              probability: 0,
              restock_threshold: 100,
              note: 'Gagal memprediksi',
            });
          }
        }
        setAiPredictions(predictions);
        setLoadingAi(false);
      } catch (err) {
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    todayIncome,
    todayCount,
    averageOrder,
    lowStockProducts, // produk dengan stok ≤ min_stock
    bestSellers,
    chartData,
    loading,
    aiPredictions, // prediksi AI untuk produk low stock (sudah include need_restock & probability)
    loadingAi,
  };
};
