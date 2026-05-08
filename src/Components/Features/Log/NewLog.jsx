import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addLog } from '../../../utils/local/log';

function NewLog() {
  const navigate = useNavigate();
  const [waktu, setWaktu] = useState('');
  const [produk, setProduk] = useState('');
  const [sku, setSku] = useState('');
  const [tipe, setTipe] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [oleh, setOleh] = useState('');

  function onSubmitHandler(event) {

    if (waktu.trim() === '' || produk.trim() === '' || sku.trim() === '' || tipe.trim() === '' || jumlah.trim() === '' || oleh.trim() === '') {
      event.preventDefault();
      alert('Mohon isi semua data');
      return;
    }

    const format = `${waktu.replace('T', ' ')}:00`;

    event.preventDefault();
    addLog({
      waktu: format,
      produk,
      sku,
      tipe,
      jumlah,
      oleh,
      status: 'Menunggu audit',
    });

    navigate('/log');
  }

  return (
    <form className="py-2 px-4" onSubmit={onSubmitHandler}>

      {/* Header */}
      <h1 className="p-2 text-gray-700 text-2xl font-bold">Tambah Log Barang</h1>

      {/* input waktu */}
      <div className="px-2 mt-4 relative flex flex-col gap-2">
        <span className="font-bold">
          Waktu:
        </span>
        <input
          type="datetime-local"
          className="w-128 p-2 border-2 border-solid border-gray-200 rounded-lg"
          placeholder="Masukan waktu..."
          value={waktu}
          onChange={(n) => setWaktu(n.target.value)}
        />
      </div>

      {/* input produk */}
      <div className="px-2 mt-4 relative flex flex-col gap-2">
        <span className="font-bold">
          Nama Produk:
        </span>
        <input
          type="text"
          className="w-128 p-2 border-2 border-solid border-gray-200 rounded-lg"
          placeholder="Masukan produk..."
          value={produk}
          onChange={(n) => setProduk(n.target.value)}
        />
      </div>

      {/* input sku */}
      <div className="px-2 mt-4 relative flex flex-col gap-2">
        <span className="font-bold">
          SKU:
        </span>
        <input
          type="text"
          className="w-128 p-2 border-2 border-solid border-gray-200 rounded-lg"
          placeholder="Masukan SKU..."
          value={sku}
          onChange={(n) => setSku(n.target.value)}
        />
      </div>

      {/* input tipe */}
      <div className="px-2 mt-4 relative flex flex-col gap-2">
        <span className="font-bold">
          Tipe:
        </span>
        <select
          type="text"
          className="w-128 p-2 border-2 border-solid border-gray-200 rounded-lg"
          placeholder="Masukan kasirnya..."
          value={tipe}
          onChange={(n) => setTipe(n.target.value)}
        >
          <option>Penyesuaian manual</option>
          <option>Stok Masuk</option>
          <option>Stok Keluar</option>
        </select>
      </div>

      {/* input jumlah */}
      <div className="px-2 mt-4 relative flex flex-col gap-2">
        <span className="font-bold">
          Jumlah:
        </span>
        <input
          type="number"
          className="w-128 p-2 border-2 border-solid border-gray-200 rounded-lg"
          placeholder="Masukan jumlah..."
          value={jumlah}
          onChange={(n) => setJumlah(n.target.value)}
        />
      </div>

      {/* input by: */}
      <div className="px-2 mt-4 relative flex flex-col gap-2">
        <span className="font-bold">
          Oleh:
        </span>
        <select
          type="text"
          className="w-128 p-2 border-2 border-solid border-gray-200 rounded-lg"
          placeholder="Masukan kasirnya..."
          value={oleh}
          onChange={(n) => setOleh(n.target.value)}
        >
          <option>Admin</option>
          <option>Kasir</option>
          <option>Gudang</option>
        </select>
      </div>

      <button className="flex items-center py-2 px-4 mx-2 mt-4 gap-2 cursor-pointer bg-sky-950 text-white font-semibold border rounded-lg hover:bg-white hover:text-sky-950 hover:border hover:rounded-lg hover:border-sky-950 transition-all">
        <span>
          Konfirmasi
        </span>
      </button>
    </form>
  );
}

export default NewLog;