import React from 'react';
import InputPos from '../../Components/Features/Pos/InputPos';
import FrequentlyPos from '../../Components/Features/Pos/FrequentlyPos';
import CartPos from '../../Components/Features/Pos/CartPos';
import { useNavigate } from 'react-router-dom';

import { FaCirclePlus } from 'react-icons/fa6';

function PosPage() {
  const navigate = useNavigate();

  return (
  // <div className="py-2 px-4 h-full flex flex-col">

  //   <div className="flex flex-row justify-between items-center">

  //     {/* Header */}
  //     <h1 className="p-2 text-gray-700 text-2xl font-bold">POS Terminal</h1>

  //     {/* Button Tambah Barang */}
  //     <button
  //       onClick={() => navigate('/pos/new')}
  //       className="flex items-center gap-2 cursor-pointer bg-sky-950 p-2 mx-4 text-white font-semibold border rounded-lg hover:bg-white hover:text-sky-950 hover:border hover:rounded-lg hover:border-sky-950 transition-all">
  //       <span>
  //         <FaCirclePlus  size={16}/>
  //       </span>
  //       <span>
  //         Tambah POS baru
  //       </span>
  //     </button>
  //   </div>

  //   <div className="flex flex-1 p-4 gap-4">
  //     <div className="flex-2 flex flex-col gap-4 overflow-y-auto min-h-0">

  //       {/* Input Voice */}
  //       <div className="flex-shrink-0">
  //         <InputPos />
  //       </div>

  //       {/* Produk sering dibeli */}
  //       <div className="">
  //         <FrequentlyPos />
  //       </div>
  //     </div>

  //     {/* Keranjang */}
  //     <div className="flex flex-col border border-gray-400 rounded-md">
  //       <CartPos />
  //     </div>

    //   </div>
    // </div>
    <div className='px-4 h-full flex flex-col'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2'>
        <h1 className='text-2xl font-bold'>POS Terminal</h1>
        <button
          onClick={() => navigate('/pos/new')}
          className='flex items-center gap-2 bg-sky-950 p-2 px-4 text-white font-semibold border cursor-pointer rounded-lg hover:bg-white hover:text-sky-950 transition'
        >
          <FaCirclePlus size={16} />
          Tambah POS baru
        </button>
      </div>
      <div className='flex flex-col lg:flex-row gap-4 mt-4 flex-1'>
        <div className='flex flex-col gap-4 lg:w-3/4'>
          <InputPos />
          <FrequentlyPos />
        </div>
        <div className='border border-gray-400 rounded-md lg:w-1/4 ml-auto'>
          <CartPos />
        </div>
      </div>
    </div>
  );
}

export default PosPage;
