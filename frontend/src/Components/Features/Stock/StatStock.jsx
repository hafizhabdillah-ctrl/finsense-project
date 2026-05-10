import React from 'react';


function StatStock() {
  return (
    <div className="flex w-full gap-4 mt-4">

      {/* Barang aktif */}
      <div className="relative flex-1 flex flex-col justify-between bg-white p-4 border rounded-md border-gray-300 shadow-sm">
        <h1 className="text-gray-500 font-bold text-sm uppercase tracking-wider">
          TOTAL BARANG AKTIF
        </h1>
        <p className="flex items-center gap-2 text-2xl font-bold text-sky-950">
          <span>
            1248
          </span>
          <span className="relative text-sm top-1">
            Barang
          </span>
        </p>
      </div>

      {/* Prediksi */}
      <div className="relative flex-1 flex flex-col justify-between bg-white p-4 border rounded-md border-gray-300 shadow-sm">
        <h1 className="text-gray-500 font-bold text-sm uppercase tracking-wider">
          PREDIKSI RESTOCK
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

      {/* Stok menipis */}
      <div className="relative flex-1 flex flex-col justify-between bg-white p-4 border rounded-md border-gray-300 shadow-sm">
        <h1 className="text-gray-500 font-bold text-sm uppercase tracking-wider">
          STOK MENIPIS
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

export default StatStock;