import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useTransactions } from '../../../hooks/useTransactions';

ChartJS.register(ArcElement, Tooltip, Legend);

function SummaryTransaction() {
  const { transactions } = useTransactions();

<<<<<<< HEAD
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
=======
  // Dapatkan bulan dan tahun saat ini
  const now = new Date();
  const currentMonth = now.getMonth(); // 0 = Januari, 4 = Mei, dst.
  const currentYear = now.getFullYear();

  const getChartData = (type) => {
    // Filter berdasarkan tipe dan bulan/tahun
    const filtered = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        t.type === type &&
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });

    // REDUCE untuk mengelompokkan & menjumlahkan (Grouping)
    const grouped = filtered.reduce((acc, t) => {
      const categoryName = t.category.trim();

      if (!acc[categoryName]) {
        acc[categoryName] = 0;
      }

      acc[categoryName] += Number(t.amount);
      return acc;
    }, {});

    // Ambil hasil grouping untuk Chart
    const labels = Object.keys(grouped);
    const dataPoints = Object.values(grouped);

    return {
      labels,
      datasets: [{
        data: dataPoints,
        backgroundColor: ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
        borderWidth: 1,
      }]
>>>>>>> 9f95b9982ac407d68f939366f6996c2c0b9d537f
    };
  };

  const incomeData = getChartData('Masuk');
  const expenseData = getChartData('Keluar');

  const hasIncomeData = incomeData.datasets[0].data.length > 0;
  const hasExpenseData = expenseData.datasets[0].data.length > 0;

  // Data placeholder jika kosong
  const emptyData = {
    labels: ['Tidak ada data'],
    datasets: [{
      data: [1],
      backgroundColor: ['#e5e7eb'],
      borderWidth: 0,
    }]
  };

  const options = {
    plugins: { legend: { display: false } },
    cutout: '70%',
  };

  return (
<<<<<<< HEAD
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
=======
    <div className="flex flex-col bg-white p-4">

      <div className="flex flex-row ">
        <div className="flex flex-1 flex-col items-center">
          <p className="text-xs font-bold text-gray-500 mb-2 uppercase">PREDIKSI PEMASUKAN</p>
          <div className="w-40 h-40 mt-6">
            {hasIncomeData ? (
              <Doughnut data={incomeData} options={options} />
            ) : (
              <div className="relative">
                <Doughnut data={emptyData} options={options} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] text-gray-400 font-semibold">KOSONG</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Grafik Pengeluaran */}
        <div className="flex flex-1 flex-col items-center">
          <p className="text-xs font-bold text-gray-500 mb-2 uppercase">ALOKASI PENGELUARAN</p>
          <div className="w-40 h-40 mt-6">
            {hasExpenseData ? (
              <Doughnut data={expenseData} options={options} />
            ) : (
              <div className="relative">
                <Doughnut data={emptyData} options={options} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] text-gray-400 font-semibold">KOSONG</span>
                </div>
              </div>
            )}
>>>>>>> 9f95b9982ac407d68f939366f6996c2c0b9d537f
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
