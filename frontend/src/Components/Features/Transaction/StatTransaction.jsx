import React from 'react';
import { transactions } from '../../../utils/local/transaction';

function StatTransaction() {

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

  return (
    <div className="flex w-1/2 gap-4 mt-4">

      {/* Barang aktif */}
      <div className="relative flex-1 flex flex-col justify-between bg-white p-4 border rounded-md border-gray-300 shadow-sm">
        <h1 className="text-gray-500 font-bold text-sm uppercase tracking-wider">
          TOTAL Pemasukan BULAN INI
        </h1>
        <p className="flex items-center gap-2 text-2xl font-bold text-sky-950">
          <span>
            Rp.
          </span>
          <span>
            {incomeTotal.toLocaleString('id-ID')}
          </span>
        </p>
      </div>

      {/* Prediksi */}
      <div className="relative flex-1 flex flex-col justify-between bg-white p-4 border rounded-md border-gray-300 shadow-sm">
        <h1 className="text-gray-500 font-bold text-sm uppercase tracking-wider">
          TOTAL PENGELUARAN BULAN INI
        </h1>
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