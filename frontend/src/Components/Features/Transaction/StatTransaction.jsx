import React, { useMemo } from 'react';
import { useTransactions } from '../../../hooks/useTransactions';

function StatTransaction() {

  // 1. Dapatkan string bulan ini (Contoh: "2024-05")
  const currentMonth = new Date().toISOString().slice(0, 7);

  // 2. Filter transaksi yang terjadi di bulan ini saja
  const monthlyTransactions = transactions.filter((item) =>
    item.date.startsWith(currentMonth)
  );

  // Hitung Pemasukan Bulanan
  const incomeTotal = monthlyTransactions
    .filter((item) => item.type === 'Masuk')
    .reduce((acc, item) => acc + Number(item.amount), 0);

  // Hitung Pengeluaran Bulanan
  const expenseTotal = monthlyTransactions
    .filter((item) => item.type === 'expense')
    .reduce((acc, item) => acc + item.amount, 0);

  return (
    <div className='flex w-1/2 gap-4 mt-4'>
      <div className='relative flex-1 flex flex-col justify-between bg-white p-4 border rounded-md shadow-sm'>
        <h1 className='text-gray-500 font-bold text-sm uppercase'>
          TOTAL PEMASUKAN BULAN INI
        </h1>
<<<<<<< HEAD
        <p className='flex items-center gap-2 text-2xl font-bold text-sky-950'>
          <span>Rp.</span>
          <span>{totals.income.toLocaleString()}</span>
=======
        <p className="flex items-center gap-2 text-2xl font-bold text-sky-950">
          <span>
            Rp.
          </span>
          <span>
            {incomeTotal.toLocaleString('id-ID')}
          </span>
>>>>>>> 9f95b9982ac407d68f939366f6996c2c0b9d537f
        </p>
      </div>
      <div className='relative flex-1 flex flex-col justify-between bg-white p-4 border rounded-md shadow-sm'>
        <h1 className='text-gray-500 font-bold text-sm uppercase'>
          TOTAL PENGELUARAN BULAN INI
        </h1>
        <p className='flex items-center gap-2 text-2xl font-bold text-sky-950'>
          <span>Rp.</span>
          <span>{totals.expense.toLocaleString()}</span>
        <p className="flex items-center gap-2 text-2xl font-bold text-sky-950">
          <span>
            Rp.
          </span>
          <span>
            {expenseTotal.toLocaleString('id-ID')}
          </span>
        </p>
      </div>
    </div>
  );
}

export default StatTransaction;
