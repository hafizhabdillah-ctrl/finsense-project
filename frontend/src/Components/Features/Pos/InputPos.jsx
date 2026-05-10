import React from 'react';
import { FaMicrophone } from 'react-icons/fa';

function InputPos() {
  return (
    <div className="flex flex-col items-center py-12 gap-4">

      <p className="text-lg font-semibold text-sky-950 mb-2">"Lorem Ipsum Prompt"</p>

      {/* Icon Mikrofon Tengah */}
      <button className="flex bg-sky-950 p-5 border rounded-xl text-white cursor-pointer hover:bg-white hover:text-sky-950 hover:border hover:rounded-xl hover:border-sky-950 transition-all">
        <FaMicrophone size={28} />
      </button>

      <p className="text-gray-400 text-sm">Memproses perintah...</p>

      {/* Box Konfirmasi */}
      <div className="w-full max-w-[500px] border border-gray-400 rounded-md p-4 mt-4">
        <p className="text-gray-600 font-medium mb-4 flex items-center gap-2">
          Tambahkan ke Keranjang?
        </p>

        {/* Informasi Produk */}
        <div className="flex justify-between items-center pb-4 mb-6">
          <span className="font-bold text-gray-800">1x
            <span className="ml-1">
              Lorem Ipsum Prompt
            </span>
          </span>
          <span className="font-bold text-gray-800">Rp 10.000</span>
        </div>

        {/* Button konfirmasi */}
        <div className="flex gap-2">
          <button className="flex-3 p-3 bg-sky-950 rounded-xl text-white font-bold cursor-pointer hover:bg-white hover:text-sky-950 hover:border hover:rounded-xl hover:border-sky-950 transition-all">
            Konfirmasi
          </button>
          <button className="flex-1 p-3 border border-gray-400 rounded-xl font-bold text-gray-500 cursor-pointer hover:border-gray-500 hover:text-gray-500 transition-all">
            Batal
          </button>
        </div>
      </div>

    </div>
  );
}

export default InputPos;