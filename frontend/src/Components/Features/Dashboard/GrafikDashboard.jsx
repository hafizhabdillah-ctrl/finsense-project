import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useDashboardData } from '../../../hooks/useDashboardData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

function GrafikDashboard() {
  const { chartData, loading } = useDashboardData();

  if (loading)
    return (
      <div className='flex-1 p-4 bg-white rounded-md shadow'>
        Memuat grafik...
      </div>
    );

  const data = {
    labels: chartData.dates,
    datasets: [
      {
        label: 'Pemasukan (Rp)',
        data: chartData.amounts,
        borderColor: '#0c4a6e',
        backgroundColor: 'rgba(12, 74, 110, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Penjualan 7 Hari Terakhir' },
    },
  };

  return (
    <div className='flex-1 p-4 bg-white rounded-md shadow'>
      <Line data={data} options={options} />
    </div>
  );
}

export default GrafikDashboard;
