import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { stocks } from '../../../utils/local/stock.js';


function TableStock() {
  const navigate = useNavigate();

  {/* Variabel untuk ganti halaman tabel */}
  const [currentPage, setCurrentPage] = useState(1);

  {/* Set batas maksimal stok yang ditampilkan */}
  const itemsPerPage = 5;

  {/* Hitung batas akhir indeks stok halaman tertentu cth: 2 x 5 = 10 */}
  const indexOfLastItem = currentPage * itemsPerPage;

  {/* Hitung batas awal indeks stok halaman tertentu cth: 10 - 5 = 5 */}
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  {/* Buat variabel untuk menampung data stok halaman tertentu */}
  const currentItems = stocks.slice(indexOfFirstItem, indexOfLastItem);

  const totalItems = stocks.length;
  const startRange = indexOfFirstItem + 1;

  {/* Tampilkan angka urutan terakhir untuk mencegah "Menampilkan 6-10 padahal stok ada 7" */}
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
          No.
        </div>
        <div className="flex-4 text-center">
          Nama Produk
        </div>
        <div className="flex-4 text-center">
          SKU
        </div>
        <div className="flex-2 text-center">
          Stok
        </div>
        <div className="flex-4 text-center">
          Status
        </div>
      </div>

      {/* Daftar Produk dalam Tabel */}
      <div className="flex flex-col">
        {currentItems.map((stocks, index) => {
          return (
            <div
              key={stocks.id}
              onClick={() => navigate(`/stocks/${stocks.id}`)}
              className="flex items-center w-full p-2 border-b border-s border-r border-gray-300 cursor-pointer hover:bg-gray-300 transition-all"
            >
              {/* Nomor biar urut kalau ada yang dihapus */}
              <div className="flex-1 text-center text-gray-800 text-sm">
                {indexOfFirstItem + index + 1}
              </div>

              {/* Nama Produk */}
              <div className="flex-4 text-center text-gray-800 text-sm">
                {stocks.name}
              </div>

              {/* sku */}
              <div className="flex-4 text-center text-gray-800 text-sm">
                {stocks.sku}
              </div>

              {/* jumlah */}
              <div className="flex-2 text-center text-gray-800 text-sm">
                {stocks.qty}
              </div>

              {/* Status */}
              <div className="flex-4 text-center text-gray-800 text-sm">
                {stocks.status}
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
    </div>
  );
}

export default TableStock;