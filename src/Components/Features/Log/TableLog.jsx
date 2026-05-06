import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logs } from '../../../utils/local/log';

import { FaCirclePlus } from 'react-icons/fa6';

function TableLog() {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = logs.slice(indexOfFirstItem, indexOfLastItem);

  const totalItems = logs.length;
  const startRange = indexOfFirstItem + 1;

  const endRange = Math.min(indexOfLastItem, totalItems);

  {/* Fungsi ganti halaman tabel */}
  const goToNextPage = () => {
    if (indexOfLastItem < totalItems)
      setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1)
      setCurrentPage(currentPage - 1);
  };

  async function onAddHandler() {
    navigate('/new/newlog');
  }


  return (
    <div>

      {/* Tabel */}
      {/* Header Tabel */}
      <div className="bg-sky-950 p-2 flex w-full mt-4 text-white font-semibold">
        <div className="flex-1 text-center">
          Waktu
        </div>
        <div className="flex-1 text-center">
          Produk
        </div>
        <div className="flex-1 text-center">
          SKU
        </div>
        <div className="flex-1 text-center">
          Tipe
        </div>
        <div className="flex-1 text-center">
          Jumlah
        </div>
        <div className="flex-1 text-center">
          Oleh
        </div>
        <div className="flex-1 text-center">
          Status
        </div>
      </div>

      {/* Daftar hutang */}
      <div className="flex flex-col">
        {currentItems.map((logs) => {
          return (
            <div
              key={logs.id}
              onClick={() => navigate(`/log/${logs.id}`)}
              className="flex items-center w-full p-2 border-b border-s border-r border-gray-300 cursor-pointer hover:bg-gray-300 transition-all"
            >
              {/* Waktu */}
              <div className="flex-1 text-center text-gray-800 text-sm">
                {logs.waktu}
              </div>

              {/* Nama Produk */}
              <div className="flex-1 text-center text-gray-800 text-sm font-bold">
                {logs.produk}
              </div>

              {/* SKU */}
              <div className="flex-1 text-center text-gray-500 text-sm">
                {logs.sku}
              </div>

              {/* tipe */}
              <div className="flex-1 text-center text-gray-500 text-sm">
                {logs.tipe}
              </div>

              {/* jumlah */}
              <div className="flex-1 text-center text-gray-800 text-sm">
                {logs.jumlah}
              </div>

              {/* oleh */}
              <div className="flex-1 text-center text-gray-800 text-sm">
                {logs.oleh}
              </div>

              {/* status */}
              <div className="flex-1 text-center text-gray-800 text-sm">
                {logs.status}
              </div>
            </div>
          );
        })}

        {/* Footer tabel */}
        {/* Menampilkan informasi total stok */}
        <div className="p-2 border-t border-gray-200 flex justify-between">
          <p className="text-sm text-gray-500 flex gap-1">
            Menampilkan
            <span>
              {startRange}-{endRange}
            </span>
              dari
            <span>
              {totalItems}
            </span>
              produk
          </p>
          <div className="flex gap-2">

            {/* Button buat ganti halaman tabel*/}
            {/* Button Sebelumnya */}
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`px-3 py-1 text-sm border rounded-md font-medium transition-all ${
                currentPage === 1 ? 'text-gray-300 border-gray-200' : 'cursor-pointer text-gray-600 border-gray-300 hover:bg-white active:bg-gray-100'
              }`}>
              Sebelumnya
            </button>

            {/* Button Selanjutnya */}
            <button
              onClick={goToNextPage}
              disabled={indexOfLastItem >= totalItems}
              className={`px-3 py-1 text-sm border rounded-md font-medium transition-all ${
                indexOfLastItem >= totalItems ? 'text-gray-300 border-gray-200' : 'cursor-pointer text-gray-600 border-gray-300 hover:bg-white active:bg-gray-100'
              }`}>
              Selanjutnya
            </button>

          </div>
        </div>
      </div>

      {/* Button tambah log barang */}
      <button
        onClick={() => onAddHandler()}
        className="flex items-center gap-2 cursor-pointer bg-sky-950 p-2 text-white font-semibold border rounded-lg hover:bg-white hover:text-sky-950 hover:border hover:rounded-lg hover:border-sky-950 transition-all">
        <span>
          <FaCirclePlus  size={16}/>
        </span>
        <span>
          Tambah Log Barang
        </span>
      </button>
    </div>
  );
}

export default TableLog;