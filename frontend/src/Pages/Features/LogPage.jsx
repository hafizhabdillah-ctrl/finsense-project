import React from 'react';
import StatLog from '../../Components/Features/Log/StatLog';
import TableLog from '../../Components/Features/Log/TableLog';
import { useNavigate } from 'react-router-dom';
import { FaCirclePlus } from 'react-icons/fa6';

function LogPage() {
  const navigate = useNavigate();

  return (
    <div className='p-2 md:p-4'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4'>
        <h1 className='p-2 text-gray-700 text-xl md:text-2xl font-bold'>
          Log Barang
        </h1>
        <button
          onClick={() => navigate('/logs/new')}
          className='flex items-center gap-2 cursor-pointer bg-sky-950 p-2 px-4 text-white font-semibold border rounded-lg hover:bg-white hover:text-sky-950 transition-all'
        >
          <FaCirclePlus size={16} />
          <span>Tambah Log baru</span>
        </button>
      </div>
      <StatLog />
      <div className='overflow-x-auto mt-4'>
        <TableLog />
      </div>
    </div>
  );
}

export default LogPage;
