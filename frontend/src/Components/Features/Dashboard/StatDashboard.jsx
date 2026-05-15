import React from 'react';
import { useDashboardData } from '../../../hooks/useDashboardData';

function StatDashboard() {
  const { todayIncome, todayCount, averageOrder, loading } = useDashboardData();

  if (loading) {
    return <div className='flex gap-4'>Memuat statistik...</div>;
  }

  return (
    <div className='flex flex-col w-full gap-4'>
      {/* statistik asli dari hook */}
      <div className='flex w-full gap-4'>
        <div className='flex-1 bg-white p-4 border rounded-md border-gray-300 shadow-sm'>
          <h2 className='text-gray-500 text-sm font-semibold'>
            Pemasukan Hari Ini
          </h2>
          <p className='text-2xl font-bold text-sky-950'>
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
      <div className='flex flex-row w-full gap-4 items-stretch'>
        <div className='relative flex-1 flex flex-col justify-between bg-white p-4 border rounded-md border-gray-300 shadow-sm'>
          <div>
            <h1 className='text-gray-500 font-bold text-sm uppercase tracking-wider'>
              PREDIKSI PEMASUKAN
            </h1>
            <p className='text-2xl font-bold text-sky-950'>Rp 1.500.000</p>
          </div>
          <p className='flex items-center mt-2 gap-2'>
            <span className='text-md leading-none text-green-500'>&#8599;</span>
            <span className='font-bold text-xs tracking-tight text-green-500'>
              +12.42% vs kemarin
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default StatDashboard;
