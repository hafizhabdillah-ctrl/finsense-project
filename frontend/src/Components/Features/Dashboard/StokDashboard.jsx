import React from 'react';
import { useDashboardData } from '../../../hooks/useDashboardData';

function StokDashboard() {
  const { lowStockProducts, loading } = useDashboardData();

  if (loading)
    return (
      <div className='flex-1 p-4 bg-white rounded-md shadow'>
        Memuat stok...
      </div>
    );

  return (
    <div className='flex-1 p-4 bg-white rounded-md shadow'>
      <h2 className='font-bold text-gray-700 mb-2'>Stok Menipis</h2>
      {lowStockProducts.length === 0 ? (
        <p className='text-gray-500'>Semua stok aman.</p>
      ) : (
        <ul className='space-y-2'>
          {lowStockProducts.map((p) => (
            <li key={p.id} className='flex justify-between border-b pb-1'>
              <span>{p.name}</span>
              <span className='text-red-500'>Stok: {p.stock}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StokDashboard;
