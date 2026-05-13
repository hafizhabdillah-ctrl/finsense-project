import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useTransactions } from '../../../hooks/useTransactions';

ChartJS.register(ArcElement, Tooltip, Legend);

function SummaryTransaction() {
  const { transactions } = useTransactions();

  const getChartData = (type) => {
    const filtered = transactions.filter((t) => t.type === type);
    const labels = [
      ...new Set(filtered.map((t) => t.category?.name || 'Tanpa Kategori')),
    ];
    const dataPoints = labels.map((label) =>
      filtered
        .filter((t) => (t.category?.name || 'Tanpa Kategori') === label)
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

  const incomeData = getChartData('income');
  const expenseData = getChartData('expense');

  const options = {
    plugins: { legend: { display: false } },
    cutout: '70%',
  };

  return (
    <div className='flex flex-col bg-white p-4'>
      <div className='flex flex-row'>
        <div className='flex flex-1 flex-col items-center'>
          <p className='text-xs font-bold text-gray-500 mb-2 uppercase'>
            PREDIKSI PEMASUKAN
          </p>
          <div className='w-40 h-40 mt-6'>
            <Doughnut data={incomeData} options={options} />
          </div>
        </div>
        <div className='flex flex-1 flex-col items-center'>
          <p className='text-xs font-bold text-gray-500 mb-2'>PENGELUARAN</p>
          <div className='w-40 h-40 mt-6'>
            <Doughnut data={expenseData} options={options} />
          </div>
        </div>
        <div className='flex flex-col flex-1 border-l border-gray-300 px-6'>
          <h1 className='flex flex-row gap-1 text-lg font-bold text-sky-950 mb-2'>
            <span>Evaluasi AI</span>
            <span className='flex items-start text-green-500 text-xs font-bold'>
              &#11212; AI Powered
            </span>
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
