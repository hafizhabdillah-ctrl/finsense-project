import React from 'react';
import { FaBox } from 'react-icons/fa';

function StokDashboard() {
  const stockItems = [];

  return (
    <div className="flex-1 p-4 border rounded-md border-gray-300 shadow-sm">

      {/* Header*/}
      <div className="">
        <h1 className="text-gray-700 text-xl font-bold">
          <span>
            Keadaan Stok
          </span>
        </h1>
      </div>

      {/* List Stok */}
      <div>
        <div className="flex flex-col gap-3 overflow-y-auto">
          {stockItems.length > 0 ? stockItems.map((item) => {
            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-2">

                {/* Info Icon & Teks */}
                <div className="flex items-center gap-4">

                  {/* Kotak Ikon Biru */}
                  <div className="w-10 h-10 rounded bg-blue-100 text-sky-900 flex items-center justify-center">
                    <FaBox size={18} />
                  </div>

                  {/* Nama dan Sisa Stok */}
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800 text-sm">
                      {item.name}
                    </span>
                    <span
                      className="text-gray-500">
                      Sisa {item.stock} unit
                    </span>
                  </div>
                </div>

                {/* Tombol Restok */}
                <button
                  className="border p-2 px-3 rounded-lg border-sky-900 bg-sky-950 text-white hover:bg-white hover:text-sky-950 transition cursor-pointer">
                  <span className="text-sm font-bold tracking-wider">
                    Restok
                  </span>
                </button>
              </div>
            );
          }) : <p className="text-gray-500 text-center py-4">Stok masih kosong</p>}
        </div>
      </div>
    </div>
  );
}

export default StokDashboard;
