import React from 'react';

function StatLog() {
  return (
    <div className="flex w-full gap-4 mt-4">

      {/* Total transaksi hari ini */}
      <div className="relative flex-1 flex flex-col justify-between bg-white p-4 border rounded-md border-gray-300 shadow-sm">
        <h1 className="text-gray-500 font-bold text-sm uppercase tracking-wider">
          TOTAL TRANSAKSI HARI INI
        </h1>
        <p className="flex items-center gap-2 text-2xl font-bold text-sky-950">
          <span>
            1248
          </span>
          <span className="relative text-sm top-1">
            Transaksi
          </span>
        </p>
      </div>

      {/* Stok masuk */}
      <div className="relative flex-1 flex flex-col justify-between bg-white p-4 border rounded-md border-gray-300 shadow-sm">
        <h1 className="text-gray-500 font-bold text-sm uppercase tracking-wider">
          STOK MASUK
        </h1>
        <p className="flex items-center gap-2 text-2xl font-bold text-sky-950">
          <span>
            12
          </span>
          <span className="relative text-sm top-1">
            Barang
          </span>
        </p>
      </div>

      {/* Stok keluar */}
      <div className="relative flex-1 flex flex-col justify-between bg-white p-4 border rounded-md border-gray-300 shadow-sm">
        <h1 className="text-gray-500 font-bold text-sm uppercase tracking-wider">
          STOK KELUAR
        </h1>
        <p className="flex items-center gap-2 text-2xl font-bold text-sky-950">
          <span>
            5
          </span>
          <span className="relative text-sm top-1">
            Barang
          </span>
        </p>
      </div>
    </div>
  );
}

export default StatLog;