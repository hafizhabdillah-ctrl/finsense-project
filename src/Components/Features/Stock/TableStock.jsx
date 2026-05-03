import React, { useState } from 'react';
import { FaCirclePlus } from 'react-icons/fa6';

function TableStock() {
  const stockItems = [
    { id: 1, name: 'Es Teh', sku: 'ET-DR-01', status: 'Aman' },
    { id: 2, name: 'Ayam Geprek', sku: 'AG-FD-01', status: 'Menipis' },
    { id: 3, name: 'Magelangan', sku: 'MG-FD-02', status: 'Menipis' },
    { id: 4, name: 'Es Kopi', sku: 'EK-DR-02', status: 'Aman' },
    { id: 5, name: 'Nasi Goreng', sku: 'MG-FD-03', status: 'Aman' },
    { id: 6, name: 'Es Coklat', sku: 'EC-DR-03', status: 'Menipis' },
    { id: 7, name: 'Ayam Katsu', sku: 'AK-FD-04', status: 'Aman' },
    { id: 8, name: 'Mie Jebew', sku: 'MF-FD-05', status: 'Aman' },
    { id: 9, name: 'Ayam Goreng', sku: 'AG-FD-06', status: 'Aman' },
    { id: 10, name: 'Jus Mangga', sku: 'JM-DR-04', status: 'Menipis' },
    { id: 11, name: 'Jus Alpukat', sku: 'JA-DR-05', status: 'Menipis' }
  ];


  {/* Variabel untuk ganti halaman tabel */}
  const [currentPage, setCurrentPage] = useState(1);

  {/* Set batas maksimal stok yang ditampilkan */}
  const itemsPerPage = 5;

  {/* Hitung batas akhir indeks stok halaman tertentu cth: 2 x 5 = 10 */}
  const indexOfLastItem = currentPage * itemsPerPage;

  {/* Hitung batas awal indeks stok halaman tertentu cth: 10 - 5 = 5 */}
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  {/* Buat variabel untuk menampung data stok halaman tertentu */}
  const currentItems = stockItems.slice(indexOfFirstItem, indexOfLastItem);

  const totalItems = stockItems.length;
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
        <div className="flex-4 text-center">
          Status
        </div>
      </div>

      {/* Daftar Produk dalam Tabel */}
      <div className="flex flex-col">
        {currentItems.map((item) => {
          return (
            <div
              key={item.id}
              className="flex items-center w-full p-2 border-b border-s border-r border-gray-300"
            >
              {/* Nomor */}
              <div className="flex-1 text-center text-gray-800 text-sm">
                {item.id}
              </div>

              {/* Nama Produk */}
              <div className="flex-4 text-center text-gray-800 text-sm">
                {item.name}
              </div>

              {/* Total */}
              <div className="flex-4 text-center text-gray-800 text-sm">
                {item.sku}
              </div>

              {/* Status */}
              <div className="flex-4 text-center text-gray-800 text-sm">
                {item.status}
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

      {/* Button Tambah Barang */}
      <button className="flex items-center gap-2 cursor-pointer bg-sky-950 p-2 text-white font-semibold border rounded-lg hover:bg-white hover:text-sky-950 hover:border hover:rounded-lg hover:border-sky-950 transition-all">
        <span>
          <FaCirclePlus  size={16}/>
        </span>
        <span>
          Tambah Barang
        </span>
      </button>
    </div>
  );
}

export default TableStock;