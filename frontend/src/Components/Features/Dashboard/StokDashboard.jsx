import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBox } from 'react-icons/fa';
import api from '../../../services/api';

// Helper: Ambil riwayat stok 7 hari terakhir untuk suatu produk
const getStockHistory = async (productId, currentStock) => {
  const days = 7;
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (days - 1));
  startDate.setHours(0, 0, 0, 0);

  try {
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

    // Inisialisasi data per hari
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

    // Akumulasi dari stock logs
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

    // Hitung stok akhir berurutan (running)
    const sortedKeys = Object.keys(daily).sort();
    let totalNet = 0;
    for (const key of sortedKeys) {
      totalNet += daily[key].Stock_In - daily[key].Stock_Out;
    }
    let runningStock = currentStock - totalNet;
    const history = sortedKeys.map((key) => {
      runningStock += daily[key].Stock_In - daily[key].Stock_Out;
      daily[key].Stock_End = Math.max(0, runningStock);
      return {
        Units_Sold: daily[key].Units_Sold,
        Stock_Out: daily[key].Stock_Out,
        Stock_In: daily[key].Stock_In,
        DayOfWeek: daily[key].DayOfWeek,
        DayOfMonth: daily[key].DayOfMonth,
        Month: daily[key].Month,
        Stock_End: daily[key].Stock_End,
      };
    });
    return history;
  } catch (err) {
    console.warn('Gagal mengambil stock logs, gunakan data dummy', err);
    // Fallback: 7 hari dummy dengan stok konstan
    const dummy = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      dummy.push({
        Units_Sold: 0,
        Stock_Out: 0,
        Stock_In: 0,
        DayOfWeek: d.getDay(),
        DayOfMonth: d.getDate(),
        Month: d.getMonth() + 1,
        Stock_End: currentStock,
      });
    }
    return dummy;
  }
};

const StokDashboard = () => {
  const navigate = useNavigate();
  const [restockList, setRestockList] = useState([]); // rekomendasi AI
  const [lowStockList, setLowStockList] = useState([]); // semua produk stok menipis
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestocks = async () => {
      setLoading(true);
      try {
        // 1. Ambil semua produk
        const productsRes = await api.get('/products');
        const products = productsRes.data;

        // 2. Filter produk yang stok <= min_stok (stok menipis) untuk ditampilkan di "Keadaan Stok"
        const lowStockProducts = products.filter((p) => p.stock <= p.min_stock);
        setLowStockList(lowStockProducts);

        // 3. Untuk rekomendasi AI, hanya ambil produk stok menipis dan panggil AI
        const predictions = [];
        for (const product of lowStockProducts.slice(0, 10)) {
          try {
            // Panggil endpoint AI (GET dengan ID)
            const aiRes = await api.get(`/ai/predict-stock/${product.id}`);
            if (aiRes.data.need_restock) {
              predictions.push({
                id: product.id,
                name: product.name,
                stock: product.stock,
                min_stock: product.min_stock,
                probability: aiRes.data.probability,
              });
            }
          } catch (err) {
            console.error(`Prediksi AI gagal untuk ${product.name}`, err);
          }
        }
        setRestockList(predictions);
      } catch (err) {
        console.error('Gagal mengambil data produk', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestocks();
  }, []);

  return (
    <div className='space-y-6'>
      {/* Bagian Rekomendasi Restok (AI) */}
      <div className='bg-white border p-4 rounded border-gray-300 shadow-sm'>
        <div className='flex gap-1'>
        <h2 className='flex font-bold text-lg mb-2'>
          Rekomendasi Restok
        </h2>
          <span className='flex font-semibold items-start text-green-500 text-xs'>AI Powered</span>
        </div>
        {loading ? (
          <p className='text-gray-500'>Memuat prediksi...</p>
        ) : restockList.length === 0 ? (
          <p className='text-gray-500'>
            Semua produk aman, tidak perlu restok.
          </p>
        ) : (
          <ul>
            {restockList.map((p) => (
              <li key={p.id} className='mb-2 border-b pb-1'>
                <span className='font-medium'>{p.name}</span> - Stok: {p.stock}{' '}
                (min: {p.min_stock}){' '}
                <span className='text-sm text-blue-600'>
                  (Prob. restok: {(p.probability * 100).toFixed(0)}%)
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Bagian Keadaan Stok */}
      <div className='p-4 border rounded-md border-gray-300 shadow-sm'>
        <h1 className='text-xl font-bold'>Keadaan Stok</h1>
        <div className='flex flex-col gap-3 mt-2'>
          {lowStockList.map((item) => (
            <div
              key={item.id}
              className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-2 border-b border-gray-300'
            >
              <div className='flex items-center gap-4'>
                <div className='w-10 h-10 rounded bg-blue-100 flex items-center justify-center'>
                  <FaBox size={18} />
                </div>
                <div>
                  <span className='font-bold'>{item.name}</span>
                  <span className='text-gray-500 block text-sm'>
                    Sisa {item.stock} unit
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate(`/stocks/${item.id}`)}
                className='border p-2 px-3 rounded-lg bg-sky-950 text-white cursor-pointer hover:bg-white hover:text-sky-950 transition w-full sm:w-auto'
              >
                Restok
              </button>
            </div>
          ))}
          {lowStockList.length === 0 && (
            <p className='text-gray-500 text-center py-4'>
              Tidak ada produk dengan stok menipis.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StokDashboard;
