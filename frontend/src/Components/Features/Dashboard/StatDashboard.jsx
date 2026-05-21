import React, { useEffect, useState } from 'react';
import { useDashboardData } from '../../../hooks/useDashboardData';
import api from '../../../services/api';

const StatDashboard = () => {
  const { todayIncome, todayCount, averageOrder, loading } = useDashboardData();
  const [revenuePred, setRevenuePred] = useState(null);
  useEffect(() => {
    const fetchPred = async () => {
      try {
        const res = await api.get('/ai/predict-revenue');
        setRevenuePred(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPred();
  }, []);
  if (loading) {
    return <div className='flex gap-4'>Memuat statistik...</div>;
  }

  return (
    <div className='flex flex-col w-full gap-4'>
      {/* statistik asli dari hook */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <div className='bg-white p-4 border rounded-md border-gray-300 shadow-sm'>
          <h2 className='text-gray-500 text-sm font-semibold'>
            Pemasukan Hari Ini
          </h2>
          <p className='text-xl md:text-2xl font-bold text-sky-950'>
            Rp {todayIncome.toLocaleString()}
          </p>
        </div>
        <div className='flex-1 bg-white p-4 border rounded-md border-gray-300 shadow-sm'>
          <h2 className='text-gray-500 text-sm font-semibold'>
            Total Transaksi
          </h2>
          <p className='text-2xl font-bold text-sky-950'>{todayCount}</p>
        </div>
        <div className='flex-1 bg-white p-4 border rounded-md border-gray-300 shadow-sm'>
          <h2 className='text-gray-500 text-sm font-semibold'>
            Rata-rata Order
          </h2>
          <p className='text-2xl font-bold text-sky-950'>
            Rp {averageOrder.toLocaleString()}
          </p>
        </div>
      </div>

      {/* komponen dummy PREDIKSI PEMASUKAN */}
      {revenuePred && (
        <div className='bg-blue-50 p-4 rounded shadow border border-blue-200'>
          <p className='text-blue-800'>Prediksi Pemasukan Besok</p>
          <p className='text-2xl font-bold text-blue-900'>
            Rp {revenuePred.predicted_revenue.toLocaleString()}
          </p>
          <p className='text-xs text-blue-600'>{revenuePred.prediction_date}</p>
        </div>
      )}
    </div>
  );
};

export default StatDashboard;
