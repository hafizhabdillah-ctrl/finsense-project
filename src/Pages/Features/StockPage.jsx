import React from 'react';
import StatStock from '../../Components/Features/Stock/StatStock';
import TableStock from '../../Components/Features/Stock/TableStock';

function StockPage() {
  return (
    <div className="py-2 px-4">

      {/* Header */}
      <h1 className="p-2 text-gray-700 text-2xl font-bold">Manajemen Stok</h1>

      {/* Display barang aktif, prediksi, stok menipis */}
      <StatStock />

      {/* Tabel barang */}
      <TableStock />

    </div>
  );
}

export default StockPage;