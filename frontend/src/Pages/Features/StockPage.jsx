import React from 'react';
import StatStock from '../../Components/Features/Stock/StatStock';
import TableStock from '../../Components/Features/Stock/TableStock';
import { useNavigate } from 'react-router-dom';

import { FaCirclePlus } from 'react-icons/fa6';

function StockPage() {
  const navigate = useNavigate();

  return (
    <div className="py-2 px-4">

      <div className="flex flex-row justify-between items-center">

        {/* Header */}
        <h1 className="p-2 text-gray-700 text-2xl font-bold">Manajemen Stok</h1>

        {/* Button Tambah Barang */}
        <button
          onClick={() => navigate('/stocks/new')}
          className="flex items-center gap-2 cursor-pointer bg-sky-950 p-2 text-white font-semibold border rounded-lg hover:bg-white hover:text-sky-950 hover:border hover:rounded-lg hover:border-sky-950 transition-all">
          <span>
            <FaCirclePlus  size={16}/>
          </span>
          <span>
            Tambah Stok baru
          </span>
        </button>
      </div>

      {/* Display barang aktif, prediksi, stok menipis */}
      <StatStock />

      {/* Tabel barang */}
      <TableStock />

    </div>
  );
}

export default StockPage;