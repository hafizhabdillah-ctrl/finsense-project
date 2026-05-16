import React from 'react';
import StatTransaction from '../../Components/Features/Transaction/StatTransaction';
import TableTransaction from '../../Components/Features/Transaction/TableTransaction';
import SummaryTransaction from '../../Components/Features/Transaction/SummaryTransaction';
import { useNavigate } from 'react-router-dom';

import { FaCirclePlus } from 'react-icons/fa6';

function TransactionPage() {
  const navigate = useNavigate();

  return (
    // <div className="py-2 px-4">

    //   <div className="flex flex-row justify-between items-center">

    //     {/* Header */}
    //     <h1 className="p-2 text-gray-700 text-2xl font-bold">Catatan keuangan</h1>

    //     {/* Button Tambah Barang */}
    //     <button
    //       onClick={() => navigate('/transactions/new')}
    //       className="flex items-center gap-2 cursor-pointer bg-sky-950 p-2 text-white font-semibold border rounded-lg hover:bg-white hover:text-sky-950 hover:border hover:rounded-lg hover:border-sky-950 transition-all">
    //       <span>
    //         <FaCirclePlus  size={16}/>
    //       </span>
    //       <span>
    //         Tambah Transaksi baru
    //       </span>
    //     </button>
    //   </div>

    //   <StatTransaction />

    //   <TableTransaction />

    //   <div className="bg-gray-200 mt-4">
    //     <hr className="border-t border-gray-300" />
    //   </div>

    //   {/* Header */}
    //   <h1 className="p-2 text-gray-700 text-2xl font-bold">Ringkasan Keuangan</h1>

    //   <SummaryTransaction />

    // </div>
    <div className='p-2 md:p-4'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2'>
        <h1 className='p-2 text-2xl font-bold'>Catatan keuangan</h1>
        <button
          onClick={() => navigate('/transactions/new')}
          className='flex items-center gap-2 bg-sky-950 p-2 px-4 text-white rounded-lg hover:bg-white hover:text-sky-950 transition'
        >
          + Tambah Transaksi
        </button>
      </div>
      <StatTransaction />
      <div className='overflow-x-auto'>
        <TableTransaction />
      </div>
      <div className='mt-6'>
        <hr />
      </div>
      <h1 className='p-2 text-2xl font-bold'>Ringkasan Keuangan</h1>
      <SummaryTransaction />
    </div>
  );
}

export default TransactionPage;
