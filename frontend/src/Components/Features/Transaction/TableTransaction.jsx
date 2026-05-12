import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactions } from '../../../utils/local/transaction.js';

function TableTransaction() {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = transactions.slice(indexOfFirstItem, indexOfLastItem);

  const totalItems = transactions.length;
  const startRange = totalItems === 0 ? 0 : indexOfFirstItem + 1;
  const endRange = Math.min(indexOfLastItem, totalItems);


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
          No.
        </div>
        <div className="flex-4 text-center">
          Tanggal
        </div>
        <div className="flex-4 text-center">
          Kategori
        </div>
        <div className="flex-4 text-center">
          Keterangan
        </div>
        <div className="flex-4 text-center">
          Nominal
        </div>
        <div className="flex-4 text-center">
          Tipe
        </div>
      </div>

      {/* Daftar Produk dalam Tabel */}
      <div className="flex flex-col">
        {totalItems === 0 ? (
          <div className="p-8 text-center text-gray-500 border-b border-s border-r border-gray-300">
            Belum ada catatan transaksi.
          </div>
        ) : (currentItems.map((transactions, index) => {
          return (
            <div
              key={transactions.id}
              onClick={() => navigate(`/transactions/${transactions.id}`)}
              className="flex items-center w-full p-2 border-b border-s border-r border-gray-300 cursor-pointer hover:bg-gray-300 transition-all"
            >
              {/* Nomor biar urut kalau ada yang dihapus */}
              <div className="flex-1 text-center text-gray-800 text-sm">
                {indexOfFirstItem + index + 1}
              </div>

              {/* Tanggal */}
              <div className="flex-4 text-center text-gray-800 text-sm">
                {transactions.date}
              </div>

              {/* Kategori */}
              <div className="flex-4 text-center text-gray-800 text-sm">
                {transactions.category}
              </div>

              {/* Keterangan */}
              <div className="flex-4 text-center text-gray-800 text-sm">
                {transactions.description}
              </div>

              {/* Jumlah */}
              <div className="flex-4 text-center text-gray-800 text-sm">
                Rp. {transactions.amount}
              </div>

              {/* Tipe */}
              <div className="flex-4 text-center text-gray-800 text-sm">
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                  transactions.type === 'income'
                    ? 'text-green-700'
                    : 'text-red-700'
                }`}>
                  {transactions.type === 'income' ? 'Masuk' : 'Keluar'}
                </span>
              </div>
            </div>
          );
        }))}

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
              transaksi
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
export default TableTransaction;