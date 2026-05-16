import React, { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useTransactions } from '../../../hooks/useTransactions';

ChartJS.register(ArcElement, Tooltip, Legend);

function SummaryTransaction() {
  const { transactions, loading } = useTransactions();

  const getChartData = (type) => {
    const filtered = transactions.filter((t) => t.type === type);
    const labels = [...new Set(filtered.map((t) => t.category))];
    const dataPoints = labels.map((label) =>
      filtered
        .filter((t) => t.category === label)
        .reduce((sum, t) => sum + t.amount, 0),
    );
    return {
      labels,
      datasets: [
        {
          data: dataPoints,
          backgroundColor: [
            '#0ea5e9',
            '#22c55e',
            '#f59e0b',
            '#ef4444',
            '#8b5cf6',
            '#ec4899',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const incomeData = useMemo(() => getChartData('income'), [transactions]);
  const expenseData = useMemo(() => getChartData('expense'), [transactions]);

  // Cek apakah ada data (total amount > 0)
  const hasIncomeData =
    incomeData.datasets[0].data.length > 0 &&
    incomeData.datasets[0].data.reduce((a, b) => a + b, 0) > 0;
  const hasExpenseData =
    expenseData.datasets[0].data.length > 0 &&
    expenseData.datasets[0].data.reduce((a, b) => a + b, 0) > 0;

  // Data untuk grafik kosong
  const emptyData = {
    labels: ['Tidak ada data'],
    datasets: [
      {
        data: [1],
        backgroundColor: ['#e5e7eb'],
        borderWidth: 0,
      },
    ],
  };

  const options = { plugins: { legend: { display: false } }, cutout: '70%' };

  // if (loading) {
  //   return (
  //     <div className='flex flex-col bg-white p-4'>
  //       <p>Memuat ringkasan...</p>
  //     </div>
  //   );
  // }

  return (
    <div className='flex flex-col md:flex-row gap-4 bg-white p-4'>
      {/* <div className='flex-1 text-center'> */}
      {/* Grafik Pemasukan */}
      <div className='flex-1 text-center'>
        <p className='text-xs font-bold text-gray-500 mb-2 uppercase'>
          ALOKASI PEMASUKAN
        </p>
        <div className='w-32 h-32 mx-auto mt-2 relative'>
          {hasIncomeData ? (
            <Doughnut data={incomeData} options={options} />
          ) : (
            <>
              <Doughnut data={emptyData} options={options} />
              <div className='absolute inset-0 flex items-center justify-center'>
                <span className='text-[10px] text-gray-400 font-semibold'>
                  KOSONG
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Grafik Pengeluaran */}
      <div className='flex-1 text-center'>
        <p className='text-xs font-bold text-gray-500 mb-2 uppercase'>
          ALOKASI PENGELUARAN
        </p>
        <div className='w-32 h-32 mx-auto mt-2 relative'>
          {hasExpenseData ? (
            <Doughnut data={expenseData} options={options} />
          ) : (
            <>
              <Doughnut data={emptyData} options={options} />
              <div className='absolute inset-0 flex items-center justify-center'>
                <span className='text-[10px] text-gray-400 font-semibold'>
                  KOSONG
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Evaluasi AI */}
      <div className='flex-1 border-t md:border-t-0 md:border-l border-gray-300 pt-4 md:pt-0 md:pl-4'>
        <h1 className='flex flex-row gap-1 text-lg font-bold text-sky-950 mb-2'>
          Evaluasi AI <span className='text-green-500 text-xs'>AI Powered</span>
        </h1>
        <div className=' text-gray-600 text-sm space-y-1'>
          <p>✅ Lorem</p>
          <p>⚠️ Lorem </p>
          <p>💡 Lorem</p>
        </div>
      </div>
    </div>
    // </div>
  );
}

export default SummaryTransaction;
