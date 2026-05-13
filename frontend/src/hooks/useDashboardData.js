import { useState, useEffect } from 'react';
import { getTransactions } from '../services/transactionService';
import { getProducts } from '../services/productService';
import api from '../services/api';

export const useDashboardData = () => {
  const [todayIncome, setTodayIncome] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [averageOrder, setAverageOrder] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({ dates: [], amounts: [] });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Data transaksi hari ini
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
        const endOfDay = new Date(
          today.setHours(23, 59, 59, 999),
        ).toISOString();
        const todayRes = await getTransactions({
          startDate: startOfDay,
          endDate: endOfDay,
        });
        const todayTransactions = todayRes.data.filter(
          (t) => t.type === 'income',
        );
        const totalIncome = todayTransactions.reduce(
          (sum, t) => sum + t.amount,
          0,
        );
        setTodayIncome(totalIncome);
        setTodayCount(todayTransactions.length);
        setAverageOrder(
          todayTransactions.length ? totalIncome / todayTransactions.length : 0,
        );

        // 2. Grafik 7 hari terakhir
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const weeklyRes = await getTransactions({
          startDate: sevenDaysAgo.toISOString(),
          endDate: endOfDay,
        });
        const weeklyTransactions = weeklyRes.data.filter(
          (t) => t.type === 'income',
        );
        // Kelompokkan per hari
        const dailyMap = new Map();
        weeklyTransactions.forEach((t) => {
          const date = t.transaction_date.split('T')[0];
          dailyMap.set(date, (dailyMap.get(date) || 0) + t.amount);
        });
        const sortedDates = Array.from(dailyMap.keys()).sort();
        const amounts = sortedDates.map((d) => dailyMap.get(d));
        setChartData({ dates: sortedDates, amounts });

        // 3. Stok menipis
        const productsRes = await getProducts();
        const lowStock = productsRes.data.filter((p) => p.stock <= p.min_stock);
        setLowStockProducts(lowStock.slice(0, 5));

        // 4. Produk paling laku (berdasarkan quantity terjual dari transaksi)
        // Atau lebih baik jika ada endpoint terpisah. Alternatif: hitung dari stockLog dengan type 'out'.
        // Untuk sementara kita gunakan produk yang paling banyak stoknya keluar dari stockLog.
        const stockLogsRes = await api.get('/stock-logs', {
          params: { type: 'out' },
        });
        const outLogs = stockLogsRes.data;
        const productSales = new Map();
        outLogs.forEach((log) => {
          productSales.set(
            log.product_id,
            (productSales.get(log.product_id) || 0) + log.quantity,
          );
        });
        const bestIds = Array.from(productSales.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([id]) => id);
        const bestProducts = productsRes.data
          .filter((p) => bestIds.includes(p.id))
          .map((p) => ({
            ...p,
            total_terjual: productSales.get(p.id),
          }));
        setBestSellers(bestProducts);
      } catch (err) {
        console.error(err);
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
    lowStockProducts,
    bestSellers,
    chartData,
    loading,
  };
};
