import React from 'react';
import StatLog from '../../Components/Features/Log/StatLog';
import TableLog from '../../Components/Features/Log/TableLog';
import { useNavigate } from 'react-router-dom';

import { FaCirclePlus } from 'react-icons/fa6';

function LogPage() {
  const navigate = useNavigate();

  return (
    <div className="py-2 px-4">

      <div className="flex flex-row justify-between items-center">

        {/* Header */}
        <h1 className="p-2 text-gray-700 text-2xl font-bold">Log Barang</h1>

        {/* Button Tambah Barang */}
        <button
          onClick={() => navigate('/logs/new')}
          className="flex items-center gap-2 cursor-pointer bg-sky-950 p-2 text-white font-semibold border rounded-lg hover:bg-white hover:text-sky-950 hover:border hover:rounded-lg hover:border-sky-950 transition-all">
          <span>
            <FaCirclePlus  size={16}/>
          </span>
          <span>
            Tambah Log baru
          </span>
        </button>
      </div>

      <StatLog />

      <TableLog />

    </div>
  );
}

export default LogPage;