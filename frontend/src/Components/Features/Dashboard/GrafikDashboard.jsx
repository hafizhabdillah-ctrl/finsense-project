import React from 'react';

function GrafikDashboard() {
  return (
    <div className="flex-2 p-4 border rounded-md border-gray-300 shadow-sm">
      <div>
        <h1 className="flex items-start gap-1">
          <span className="text-gray-700 text-xl font-bold">
            Prediksi Pemasukan
          </span>
          <span className="text-green-500 text-xs font-bold">
            &#11212; AI Powered
          </span>
        </h1>
      </div>

      {/* Grafik */}
      <div className="flex flex-col min-h-64">

        {/* Grid Atas */}
        <div className="flex-1 flex items-center">

          {/* Label Sumbu Y */}
          <span className="text-xs text-gray-400 w-10 leading-none translate-y-1/6">
            15M
          </span>

          {/* Garis Dashed */}
          <div className="flex-1 border-b border-dashed border-gray-300"></div>
        </div>

        {/* Grid Tengah */}
        <div className="flex-1 flex items-center">
          <span className="text-xs text-gray-400 w-10 leading-none translate-y-1/6">
            10M
          </span>

          {/* Garis Dashed */}
          <div className="flex-1 border-b border-dashed border-gray-300"></div>
        </div>

        {/* Grid Bawah Sumbu X Solid */}
        <div className="flex-1 flex items-center">
          <span className="text-xs text-gray-400 w-10 leading-none translate-y-1/6">
            5M
          </span>
          <div className="flex-1 border-b border-gray-400"></div>
        </div>

        {/* Label Hari */}
        <div className="flex justify-between items-center text-xs text-gray-400 font-medium pl-[3.25rem] -mt-6 pb-2">
          <span>Sen</span>
          <span>Sel</span>
          <span className="text-sky-900 font-bold">Rab</span>
          <span>Kam</span>
          <span>Jum</span>
          <span>Sab</span>
          <span>Min</span>
        </div>

      </div>

    </div>
  );
}

export default GrafikDashboard;
