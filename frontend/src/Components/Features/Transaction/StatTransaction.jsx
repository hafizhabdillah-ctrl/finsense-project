import React from 'react';
import { transactions } from '../../../utils/local/transaction';

function StatTransaction() {

  // 1. Dapatkan string bulan ini (Contoh: "2024-05")
  const currentMonth = new Date().toISOString().slice(0, 7);

  // 2. Filter transaksi yang terjadi di bulan ini saja
  const monthlyTransactions = transactions.filter((item) =>
    item.date.startsWith(currentMonth)
  );

  // 3. Hitung Pemasukan Bulanan
  const incomeTotal = monthlyTransactions
    .filter((item) => item.type === 'income')
    .reduce((acc, item) => acc + item.amount, 0);

  // 4. Hitung Pengeluaran Bulanan
  const expenseTotal = monthlyTransactions
    .filter((item) => item.type === 'expense')
    .reduce((acc, item) => acc + item.amount, 0);

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
            {incomeTotal}
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
            {expenseTotal}
          </span>
        </p>
      </div>
    </div>
  );
}

export default StatTransaction;