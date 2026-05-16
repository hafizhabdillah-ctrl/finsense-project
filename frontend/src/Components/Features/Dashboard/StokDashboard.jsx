import React from 'react';
import { FaBox } from 'react-icons/fa';
import { useDashboardData } from '../../../hooks/useDashboardData';

function StokDashboard() {
  const { lowStockProducts, loading } = useDashboardData();

  // Data dummy untuk komponen "Keadaan Stok"
  const stockItems = [
    { id: 1, name: 'Beras Premium 5kg', stock: 3 },
    { id: 2, name: 'Minyak Goreng 2L', stock: 2 },
    { id: 3, name: 'Gula Pasir 1kg', stock: 5 },
  ];

  if (loading) {
    return (
      <div className='flex-1 p-4 bg-white rounded-md shadow'>
        Memuat stok...
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6'>
      {/* Bagian 1: Stok Menipis dari hook */}
      {/* <div className='h-fit p-4 bg-white border border-gray-300 rounded-md shadow'>
        <h2 className='text-xl font-bold text-gray-700 mb-2'>Stok Menipis</h2>
        {lowStockProducts.length === 0 ? (
          <p className='text-gray-500'>Semua stok aman.</p>
        ) : (
          <ul className='space-y-2'>
            {lowStockProducts.map((p) => (
              <li key={p.id} className='flex justify-between border-b border-gray-300 py-1 last:border-0'>
                <span className='font-semibold text-gray-800'>{p.name}</span>
                <span className='text-gray-800'>Stok: {p.stock}</span>
              </li>
            ))}
          </ul>
        )}
      </div> */}
      <div className='p-4 bg-white border border-gray-300 rounded-md shadow-sm w-full'>
        <h2 className='text-xl font-bold mb-2'>Stok Menipis</h2>
        {lowStockProducts.length === 0 ? (
          <p>Semua stok aman.</p>
        ) : (
          <ul className='space-y-2'>
            {lowStockProducts.map((p) => (
              <li key={p.id} className='flex justify-between border-b pb-1'>
                <span className='font-semibold'>{p.name}</span>
                <span>Stok: {p.stock}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Bagian 2: Keadaan Stok (komponen dummy yang diminta tetap ada) */}
      {/* <div className='h-fit p-4 border rounded-md border-gray-300 shadow-sm'>
        <div>
          <h1 className='text-gray-700 text-xl font-bold'>
            <span>Keadaan Stok</span>
          </h1>
        </div>
        <div>
          <div className='flex flex-col gap-3 overflow-y-auto'>
            {stockItems.length > 0 ? (
              stockItems.map((item) => (
                <div
                  key={item.id}
                  className='flex items-center justify-between px-2 py-3'
                >
                  <div className='flex items-center gap-4'>
                    <div className='w-10 h-10 rounded bg-blue-100 text-sky-900 flex items-center justify-center'>
                      <FaBox size={18} />
                    </div>
                    <div className='flex flex-col'>
                      <span className='font-bold text-gray-800 text-sm'>
                        {item.name}
                      </span>
                      <span className='text-gray-500'>
                        Sisa {item.stock} unit
                      </span>
                    </div>
                  </div>
                  <button className='border p-2 px-3 mx-4 rounded-lg border-sky-900 bg-sky-950 text-white hover:bg-white hover:text-sky-950 transition cursor-pointer'>
                    <span className='text-sm font-bold tracking-wider'>
                      Restok
                    </span>
                  </button>
                </div>
              ))
            ) : (
              <p className='text-gray-500 text-center py-4'>
                Stok masih kosong
              </p>
            )}
          </div>
        </div>
      </div> */}
      <div className='p-4 border rounded-md border-gray-300 shadow-sm'>
        <h1 className='text-xl font-bold'>Keadaan Stok</h1>
        <div className='flex flex-col gap-3 mt-2'>
          {stockItems.map((item) => (
            <div
              key={item.id}
              className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-2 border-b'
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
              <button className='border p-2 px-3 rounded-lg bg-sky-950 text-white hover:bg-white hover:text-sky-950 transition w-full sm:w-auto'>
                Restok
              </button>
            </div>
          ))}
          {stockItems.length === 0 && (
            <p className='text-gray-500 text-center py-4'>Stok masih kosong</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StokDashboard;
