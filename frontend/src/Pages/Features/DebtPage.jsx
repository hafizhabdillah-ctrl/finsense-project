import React from 'react';
import StatDebt from '../../Components/Features/Debt/StatDebt';
import TableDebt from '../../Components/Features/Debt/TableDebt';
import { useNavigate } from 'react-router-dom';
import { FaCirclePlus } from 'react-icons/fa6';

function Debtpage() {
  const navigate = useNavigate();

  return (
    <div className='p-2 md:p-4'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4'>
        <h1 className='p-2 text-gray-700 text-xl md:text-2xl font-bold'>
          Catatan Hutang
        </h1>
        <button
          onClick={() => navigate('/debts/new')}
          className='flex items-center gap-2 cursor-pointer bg-sky-950 p-2 px-4 text-white font-semibold border rounded-lg hover:bg-white hover:text-sky-950 transition-all'
        >
          <FaCirclePlus size={16} />
          <span>Tambah Hutang baru</span>
        </button>
      </div>
      <StatDebt />
      <div className='overflow-x-auto mt-4'>
        <TableDebt />
      </div>
    </div>
  );
}

export default Debtpage;
