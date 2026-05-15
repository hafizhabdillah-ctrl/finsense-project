import React from 'react';
import { useDashboardData } from '../../../hooks/useDashboardData';

function LakuDashboard() {
  const { bestSellers, loading } = useDashboardData();

  if (loading)
    return <div className='p-4 bg-white rounded-md shadow'>Memuat data...</div>;

  return (
    <div className='p-4'>
      <h2 className='font-bold text-gray-700 mb-2'>Produk Paling Laku</h2>
      {bestSellers.length === 0 ? (
        <p className='text-gray-500'>Belum ada data penjualan.</p>
      ) : (
        <div className='space-y-2'>
          {bestSellers.map((p, idx) => (
            <div key={p.id} className='flex justify-between border-b border-gray-300 pb-1'>
              <span className='font-semibold text-gray-800'>
                {idx + 1}. {p.name}
              </span>
              <span className='font-semibold'>
                Terjual {p.total_terjual}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LakuDashboard;
