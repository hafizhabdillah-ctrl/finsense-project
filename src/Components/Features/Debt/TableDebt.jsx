import React, { useState } from 'react';
import { FaCirclePlus } from 'react-icons/fa6';

function TableDebt() {
  const debts = [
    { id: 1, name: 'Budi', hutang: '1.250.000', tempo: '12 Desember 2026', status: 'Lunas' },
    { id: 2, name: 'Andi', hutang: '1.500.000', tempo: '13 Desember 2026', status: 'Belum Lunas' },
    { id: 3, name: 'Siti', hutang: '1.750.000', tempo: '14 Desember 2026', status: 'Belum Lunas' },
    { id: 4, name: 'Rina', hutang: '1.600.000', tempo: '15 Desember 2026', status: 'Lunas' },
    { id: 5, name: 'Doni', hutang: '1.400.000', tempo: '16 Desember 2026', status: 'Belum Lunas' },
    { id: 6, name: 'Eko', hutang: '2.100.000', tempo: '17 Desember 2026', status: 'Belum Lunas' },
    { id: 7, name: 'Maya', hutang: '950.000', tempo: '18 Desember 2026', status: 'Lunas' },
    { id: 8, name: 'Gani', hutang: '3.200.000', tempo: '19 Desember 2026', status: 'Belum Lunas' },
    { id: 9, name: 'Lia', hutang: '1.150.000', tempo: '20 Desember 2026', status: 'Lunas' },
    { id: 10, name: 'Fajar', hutang: '2.450.000', tempo: '21 Desember 2026', status: 'Belum Lunas' },
    { id: 11, name: 'Dewi', hutang: '1.800.000', tempo: '22 Desember 2026', status: 'Belum Lunas' },
    { id: 12, name: 'Heri', hutang: '700.000', tempo: '23 Desember 2026', status: 'Lunas' },
    { id: 13, name: 'Siska', hutang: '2.000.000', tempo: '24 Desember 2026', status: 'Belum Lunas' },
    { id: 14, name: 'Bambang', hutang: '1.350.000', tempo: '25 Desember 2026', status: 'Lunas' },
    { id: 15, name: 'Putri', hutang: '2.750.000', tempo: '26 Desember 2026', status: 'Belum Lunas' },
    { id: 16, name: 'Rian', hutang: '1.900.000', tempo: '27 Desember 2026', status: 'Belum Lunas' },
    { id: 17, name: 'Yanti', hutang: '3.000.000', tempo: '28 Desember 2026', status: 'Lunas' },
  ];

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
              <div className="flex-8 text-center text-gray-800 text-sm font-bold">
                {item.name}
              </div>

              {/* Total */}
              <div className="flex-8 text-center text-gray-500 text-sm">
                {item.hutang}
              </div>

              {/* Tempo */}
              <div className="flex-8 text-center text-gray-500 text-sm">
                {item.tempo}
              </div>

              {/* Status */}
              <div className="flex-8 text-center text-gray-800 text-sm">
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

      {/* Button tambah piutang */}
      <button className="flex items-center gap-2 cursor-pointer bg-sky-950 p-2 text-white font-semibold border rounded-lg hover:bg-white hover:text-sky-950 hover:border hover:rounded-lg hover:border-sky-950 transition-all">
        <span>
          <FaCirclePlus  size={16}/>
        </span>
        <span>
          Tambah Piutang
        </span>
      </button>
    </div>
  );
}

export default TableDebt;