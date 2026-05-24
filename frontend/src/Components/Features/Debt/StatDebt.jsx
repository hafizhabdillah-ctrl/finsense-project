import React from 'react';
import { useDebts } from '../../../hooks/useDebts';

function StatDebt() {
  const { debts, loading } = useDebts();

  const total = debts.reduce((acc, item) => acc + (item.total_debt || 0), 0);

  if (loading) return <div className='p-4'>Memuat total hutang...</div>;

  return (
    <div className='grid grid-cols-1 sm:grid-cols-1 gap-4 mt-4'>
      <div className='flex w-full sm:w-1/4 flex flex-col justify-between bg-white p-4 border rounded-md border-gray-300 shadow-sm'>
        <p className='text-md text-gray-500 font-semibold mb-2'>
          TOTAL PIUTANG AKTIF
        </p>
        <p className='text-sky-950 font-bold text-2xl mb-3'>
          Rp. {total.toLocaleString('id-ID')}
        </p>
        <p className='text-xs text-green-500 font-normal flex gap-1'>
          <span>&#8631;</span>
          <span>Turun 12% dibanding bulan lalu</span>
        </p>
      </div>
    </div>
  );
}

export default StatDebt;
