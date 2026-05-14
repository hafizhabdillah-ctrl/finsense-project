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
    <div className='flex flex-col bg-white p-4'>
      <div className='flex flex-row'>
        {/* Grafik Pemasukan */}
        <div className='flex flex-1 flex-col items-center'>
          <p className='text-xs font-bold text-gray-500 mb-2 uppercase'>
            PREDIKSI PEMASUKAN
          </p>
          <div className='w-40 h-40 mt-6 relative'>
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
        <div className='flex flex-1 flex-col items-center'>
          <p className='text-xs font-bold text-gray-500 mb-2 uppercase'>
            ALOKASI PENGELUARAN
          </p>
          <div className='w-40 h-40 mt-6 relative'>
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
        <div className='flex flex-col flex-1 border-l border-gray-300 px-6'>
          <h1 className='flex flex-row gap-1 text-lg font-bold text-sky-950 mb-2'>
            Evaluasi AI{' '}
            <span className='text-green-500 text-xs'>AI Powered</span>
          </h1>
          <div className='flex flex-col gap-2 text-md text-gray-600'>
            <p>✅ Pemasukan bulan ini stabil.</p>
            <p>
              ⚠️ Pengeluaran kategori{' '}
              <span className='font-bold text-red-500'>Restok</span> meningkat
              15% dari bulan lalu.
            </p>
            <p>💡 Saran: Pertimbangkan mencari supplier alternatif.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SummaryTransaction;
