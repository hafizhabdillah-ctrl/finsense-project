import React from 'react';
import StatDashboard from '../../Components/Features/Dashboard/StatDashboard';
import GrafikDashboard from '../../Components/Features/Dashboard/GrafikDashboard';
import StokDashboard from '../../Components/Features/Dashboard/StokDashboard';
import LakuDashboard from '../../Components/Features/Dashboard/LakuDashboard';

function DashboardPage() {
  return (
    <div className='py-2 px-4'>
      <h1 className='p-2 text-gray-700 text-2xl font-bold'>
        Ringkasan Penjualan Hari Ini
      </h1>
      <p className='mx-2 mb-6 text-gray-500'>
        {new Date().toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>
      <StatDashboard />
      <div className='flex flex-row w-full gap-4 items-stretch mt-4'>
        <GrafikDashboard />
        <StokDashboard />
      </div>
      <div className='mt-2'>
        <LakuDashboard />
      </div>
    </div>
  );
}

export default DashboardPage;
