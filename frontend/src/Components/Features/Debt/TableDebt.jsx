import React, { useState } from 'react';
import { debts } from '../../../utils/local/debt';
import { useNavigate } from 'react-router-dom';

function TableDebt() {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = debts.slice(indexOfFirstItem, indexOfLastItem);

  const totalItems = debts.length;
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


  return (
    <div>

      {/* Tabel */}
      {/* Header Tabel */}
      <div className="bg-sky-950 p-2 flex w-full mt-4 text-white font-semibold">
        <div className="flex-1 text-center">
          No
        </div>
        <div className="flex-8 text-center">
          Nama Pelanggan
        </div>
        <div className="flex-8 text-center">
          Total Hutang
        </div>
        <div className="flex-8 text-center">
          Jatuh Tempo
        </div>
        <div className="flex-8 text-center">
          Status
        </div>
      </div>

      {/* Daftar hutang */}
      <div className="flex flex-col">
        {currentItems.map((debts, index) => {
          return (
            <div
              key={debts.id}
              onClick={() => navigate(`/debts/${debts.id}`)}
              className="flex items-center w-full p-2 border-b border-s border-r border-gray-300 cursor-pointer hover:bg-gray-300 transition-all"
            >
              {/* Nomor */}
              <div className="flex-1 text-center text-gray-800 text-sm">
                {indexOfFirstItem + index + 1}
              </div>

              {/* Nama Produk */}
              <div className="flex-8 text-center text-gray-800 text-sm font-bold">
                {debts.name}
              </div>

              {/* Total */}
              <div className="flex-8 text-center text-gray-500 text-sm">
                {debts.hutang}
              </div>

              {/* Tempo */}
              <div className="flex-8 text-center text-gray-500 text-sm">
                {debts.tempo}
              </div>

              {/* Status */}
              <div className="flex-8 text-center text-gray-800 text-sm">
                {debts.status}
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
              hutang
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
    </div>
  );
}

export default TableDebt;