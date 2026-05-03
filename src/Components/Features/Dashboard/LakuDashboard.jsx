import React from 'react';

function LakuDashboard() {
  const stockItems = [
    { id: 1, name: 'Es Teh', terjual: 21, total: '63.000' },
    { id: 2, name: 'Ayam Geprek', terjual: 15, total: '150.000' },
    { id: 3, name: 'Magelangan', terjual: 12, total: '144.000' },
    { id: 4, name: 'Es Kopi', terjual: 7, total: '35.000' },
  ];

  return (
    <div>

      {/* Header */}
      <h1 className="text-gray-700 text-xl font-bold">Barang Paling Laku</h1>

      {/* Tabel */}
      <div>

        {/* Header Tabel */}
        <div className="bg-sky-950 p-2 flex w-full mt-4 text-white font-semibold">
          <div className="flex-1 text-center">
            Nama Produk
          </div>
          <div className="flex-1 text-center">
            Terjual hari ini
          </div>
          <div className="flex-1 text-center">
            Total Pendapatan
          </div>
        </div>

      </div>

      {/* Daftar Produk */}
      <div className="flex flex-col">
        {stockItems.map((item) => {
          return (
            <div
              key={item.id}
              className="flex items-center w-full p-2 border-b border-s border-r border-gray-300">

              {/* Nama Produk */}
              <div className="flex-1 text-center text-gray-800 text-sm">
                <span>
                  {item.name}
                </span>
              </div>

              {/* Terjual */}
              <div className="flex-1 text-center text-gray-800 text-sm">
                <span>
                  {item.terjual}
                </span>
              </div>

              {/* Total */}
              <div className="flex-1 text-center text-gray-800 text-sm">
                <span>
                  {item.total}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

export default LakuDashboard;