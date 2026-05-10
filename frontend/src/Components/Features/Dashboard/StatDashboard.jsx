import React from 'react';
import { FaMoneyBillWave, FaShoppingCart } from 'react-icons/fa';
import { IoReceipt } from 'react-icons/io5';

function StatDashboard() {
  return (
    <div className="flex flex-row w-full gap-4 items-stretch">

      {/* Total Pemasukan */}
      <div className="relative flex-1 flex flex-col justify-between bg-white p-4 border rounded-md border-gray-300 shadow-sm">
        <div>
          <h1 className="text-gray-500 font-bold text-sm uppercase tracking-wider">
            TOTAL PEMASUKAN
          </h1>
          <p className="text-2xl font-bold text-sky-950">
            Rp 1.500.000
          </p>
        </div>

        <p className="flex items-center mt-2 gap-2">
          <span className="text-md leading-none text-green-500">
            &#8599;
          </span>
          <span className="font-bold text-xs tracking-tight text-green-500">
              +12.42% vs kemarin (AMAZE AMAZE)
          </span>
        </p>

        <div className="absolute right-4 bottom-4 text-gray-400">
          <FaMoneyBillWave size={40} />
        </div>
      </div>

      {/* Transaksi Berhasil */}
      <div className="relative flex-1 flex flex-col justify-between bg-white p-4 border rounded-md border-gray-300 shadow-sm">
        <div>
          <h1 className="text-gray-500 font-bold text-sm tracking-wider">
            TRANSAKSI BERHASIL
          </h1>
          <p className="text-2xl font-bold text-sky-950">
            1129
          </p>
        </div>

        <p className="flex items-center mt-2 gap-2">
          <span className="text-md leading-none text-green-500">
            &#8599;
          </span>
          <span className="font-bold text-xs tracking-tight text-green-500">
              +6.67% vs kemarin (AMAZE AMAZE)
          </span>
        </p>

        <div className="absolute right-4 bottom-4 text-gray-400">
          <IoReceipt size={40} />
        </div>
      </div>

      {/* RATA-RATA ORDER */}
      <div className="relative flex-1 flex flex-col justify-between bg-white p-4 border rounded-md border-gray-300 shadow-sm">
        <div>
          <h1 className="text-gray-500 font-bold text-sm tracking-wider">
            RATA-RATA ORDER
          </h1>
          <p className="text-2xl font-bold text-sky-950">
            Rp 224.500
          </p>
        </div>

        <p className="flex items-center mt-2 gap-2">
          <span className="text-md leading-none text-gray-500">
            &#8594;
          </span>
          <span className="font-bold text-xs tracking-tight text-gray-500">
              Stabil
          </span>
        </p>


        <div className="absolute right-4 bottom-4 text-gray-400">
          <FaShoppingCart size={40} />
        </div>
      </div>
    </div>
  );
}

export default StatDashboard;
