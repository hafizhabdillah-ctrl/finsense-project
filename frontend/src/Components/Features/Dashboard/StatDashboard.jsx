import React from 'react';
import { useDashboardData } from '../../../hooks/useDashboardData';

function StatDashboard() {
  const { todayIncome, todayCount, averageOrder, loading } = useDashboardData();

  if (loading) return <div className='flex gap-4'>Memuat statistik...</div>;

  return (
    <div className='flex w-full gap-4'>
      <div className='flex-1 bg-white p-4 border rounded-md shadow-sm'>
        <h2 className='text-gray-500 text-sm font-semibold'>
          Pemasukan Hari Ini
        </h2>
        <p className='text-2xl font-bold text-sky-950'>
          Rp {todayIncome.toLocaleString()}
        </p>
      </div>
      <div className='flex-1 bg-white p-4 border rounded-md shadow-sm'>
        <h2 className='text-gray-500 text-sm font-semibold'>Total Transaksi</h2>
        <p className='text-2xl font-bold text-sky-950'>{todayCount}</p>
      </div>
      <div className='flex-1 bg-white p-4 border rounded-md shadow-sm'>
        <h2 className='text-gray-500 text-sm font-semibold'>Rata-rata Order</h2>
        <p className='text-2xl font-bold text-sky-950'>
          Rp {averageOrder.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default StatDashboard;
