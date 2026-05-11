import React from 'react';

function LakuDashboard() {
  const stockItems = [
    { id: 1, name: 'Telur 1kg', terjual: 20, predict: '144' },
    { id: 2, name: 'Minyak Goreng 1L', terjual: 50, predict: '134' },
    { id: 3, name: 'Gula 1kg', terjual: 30, predict: '85' },
    { id: 4, name: 'Beras 1kg', terjual: 80, predict: '94' },
  ];

  return (
    <div>

      {/* Header */}
      <h1 className="text-gray-700 text-xl font-bold">Prediksi Barang Paling Laku</h1>

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
            Prediksi Terjual
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
                  {item.predict}
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