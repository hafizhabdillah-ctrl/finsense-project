import React, { useState } from 'react';
import { FaCirclePlus } from 'react-icons/fa6';

function TableLog() {
  const logs = [
    {
      id: 1,
      waktu: '2026-05-02 10:42:00',
      produk: 'Kopi Arabika Gayo 1Kg',
      sku: 'KAG-1K-001',
      tipe: 'Penjualan POS',
      jumlah: -2,
      oleh: 'Kasir 1 (Budi)',
      status: 'Selesai'
    },
    {
      id: 2,
      waktu: '2026-05-02 09:15:00',
      produk: 'Susu UHT Full Cream 1L',
      sku: 'SUHT-1L-005',
      tipe: 'Stok Masuk',
      jumlah: 50,
      oleh: 'Gudang (Agus)',
      status: 'Selesai'
    },
    {
      id: 3,
      waktu: '2026-05-02 08:30:00',
      produk: 'Gula Pasir Premium 1Kg',
      sku: 'GPP-1K-002',
      tipe: 'Penyesuaian Manual',
      jumlah: -15,
      oleh: 'Admin (Siti)',
      status: 'Menunggu Audit'
    },
    {
      id: 4,
      waktu: '2026-05-01 16:45:00',
      produk: 'Teh Hitam Celup',
      sku: 'THC-B-010',
      tipe: 'Penjualan POS',
      jumlah: -1,
      oleh: 'Kasir 2 (Dewi)',
      status: 'Selesai'
    },
    {
      id: 5,
      waktu: '2026-05-01 14:20:00',
      produk: 'Minyak Goreng 2L',
      sku: 'MNG-2L-015',
      tipe: 'Stok Masuk',
      jumlah: 100,
      oleh: 'Gudang (Agus)',
      status: 'Selesai'
    },
    {
      id: 6,
      waktu: '2026-05-01 11:10:00',
      produk: 'Beras Pandan Wangi 5Kg',
      sku: 'BPW-5K-022',
      tipe: 'Penyesuaian Manual',
      jumlah: -2,
      oleh: 'Admin (Siti)',
      status: 'Selesai'
    },
    {
      id: 7,
      waktu: '2026-05-01 10:05:00',
      produk: 'Garam Dapur 500g',
      sku: 'GRM-5H-009',
      tipe: 'Penjualan POS',
      jumlah: -5,
      oleh: 'Kasir 1 (Budi)',
      status: 'Selesai'
    },
    {
      id: 8,
      waktu: '2026-04-30 09:30:00',
      produk: 'Sabun Mandi Cair 450ml',
      sku: 'SMC-4H-031',
      tipe: 'Stok Masuk',
      jumlah: 24,
      oleh: 'Gudang (Rian)',
      status: 'Selesai'
    },
    {
      id: 9,
      waktu: '2026-04-30 15:50:00',
      produk: 'Mie Instan Kuah (Karton)',
      sku: 'MIK-K-045',
      tipe: 'Penjualan POS',
      jumlah: -10,
      oleh: 'Kasir 2 (Dewi)',
      status: 'Selesai'
    },
    {
      id: 10,
      waktu: '2026-04-30 13:15:00',
      produk: 'Deterjen Bubuk 800g',
      sku: 'DTB-8H-012',
      tipe: 'Penyesuaian Manual',
      jumlah: 3,
      oleh: 'Admin (Siti)',
      status: 'Menunggu Audit'
    },
    {
      id: 11,
      waktu: '2026-04-29 08:45:00',
      produk: 'Kecap Manis 520ml',
      sku: 'KCM-5H-007',
      tipe: 'Penjualan POS',
      jumlah: -4,
      oleh: 'Kasir 1 (Budi)',
      status: 'Selesai'
    },
    {
      id: 12,
      waktu: '2026-04-29 17:00:00',
      produk: 'Tepung Terigu 1Kg',
      sku: 'TTG-1K-019',
      tipe: 'Stok Masuk',
      jumlah: 40,
      oleh: 'Gudang (Agus)',
      status: 'Selesai'
    }
  ];

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
        {currentItems.map((item) => {
          return (
            <div
              key={item.id}
              className="flex items-center w-full p-2 border-b border-s border-r border-gray-300"
            >
              {/* Waktu */}
              <div className="flex-1 text-center text-gray-800 text-sm">
                {item.waktu}
              </div>

              {/* Nama Produk */}
              <div className="flex-1 text-center text-gray-800 text-sm font-bold">
                {item.produk}
              </div>

              {/* SKU */}
              <div className="flex-1 text-center text-gray-500 text-sm">
                {item.sku}
              </div>

              {/* tipe */}
              <div className="flex-1 text-center text-gray-500 text-sm">
                {item.tipe}
              </div>

              {/* jumlah */}
              <div className="flex-1 text-center text-gray-800 text-sm">
                {item.jumlah}
              </div>

              {/* oleh */}
              <div className="flex-1 text-center text-gray-800 text-sm">
                {item.oleh}
              </div>

              {/* status */}
              <div className="flex-1 text-center text-gray-800 text-sm">
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

      {/* Button tambah log barang */}
      <button className="flex items-center gap-2 cursor-pointer bg-sky-950 p-2 text-white font-semibold border rounded-lg hover:bg-white hover:text-sky-950 hover:border hover:rounded-lg hover:border-sky-950 transition-all">
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