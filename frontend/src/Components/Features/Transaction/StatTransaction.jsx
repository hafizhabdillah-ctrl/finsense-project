import React, { useMemo } from 'react';
import { useTransactions } from '../../../hooks/useTransactions';

function StatTransaction() {
  // Filter hanya bulan ini
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split('T')[0];
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .split('T')[0];

<<<<<<< HEAD
  const { transactions, loading } = useTransactions({
    startDate: startOfMonth,
    endDate: endOfMonth,
  });

  const totals = useMemo(() => {
    let income = 0,
      expense = 0;
    transactions.forEach((t) => {
      if (t.type === 'income') income += t.amount;
      else expense += t.amount;
    });
    return { income, expense };
  }, [transactions]);

  // if (loading) return <div className='flex w-1/2 gap-4 mt-4'>Memuat...</div>;
=======
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const currentMonth = `${year}-${month}`;

  const monthlyTransactions = transactions.filter((item) =>
    item.date.startsWith(currentMonth)
  );

  // Hitung Pemasukan Bulanan
  const incomeTotal = monthlyTransactions
    .filter((item) => item.type === 'Masuk')
    .reduce((acc, item) => acc + Number(item.amount), 0);

  // Hitung Pengeluaran Bulanan
  const expenseTotal = monthlyTransactions
    .filter((item) => item.type === 'Keluar')
    .reduce((acc, item) => acc + Number(item.amount), 0);
>>>>>>> 9f95b9982ac407d68f939366f6996c2c0b9d537f

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
<<<<<<< HEAD
        <p className='flex items-center gap-2 text-2xl font-bold text-sky-950'>
          <span>Rp.</span>
          <span>{totals.expense.toLocaleString()}</span>
=======
        <p className="flex items-center gap-2 text-2xl font-bold text-sky-950">
          <span>
            Rp.
          </span>
          <span>
            {expenseTotal.toLocaleString('id-ID')}
          </span>
>>>>>>> 9f95b9982ac407d68f939366f6996c2c0b9d537f
        </p>
      </div>
    </div>
  );
}

export default StatTransaction;
