import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addStock } from '../../../utils/local/stock.js';
import Swal from 'sweetalert2';

function NewStock() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [qty, setQty] = useState('');

  // submit handler
  function onSubmitHandler(event) {
    event.preventDefault();

    // input gaboleh kosong
    if (name.trim() === '' || sku.trim() === '' || qty === '') {
      event.preventDefault();
      Swal.fire({
        title: 'Mohon isi seluruh data',
        icon: 'info',
      });
      return;
    }

    // jumlah gaboleh negatif
    if (Number(qty) < 0) {
      event.preventDefault();
      Swal.fire({
        title: 'Invalid Data',
        text: 'Mohon masukkan angka positif untuk Jumlah Stok',
        icon: 'warning',
        confirmButtonColor: '#0c4a6e',
      });
      return;
    }

    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Sukses',
      text: 'Stok berhasil ditambahkan',
      showConfirmButton: false,
      timer: 1500
    });

    addStock({ name, sku, qty });
    navigate('/stocks');
  }

  return (
    <form className="py-2 px-4" onSubmit={onSubmitHandler}>

      {/* Header */}
      <h1 className="p-2 text-gray-700 text-2xl font-bold">Tambah Stok Baru</h1>

      {/* input nama barang */}
      <div className="px-2 mt-4 relative flex flex-col gap-2">
        <span className="font-bold">
          Nama Barang:
        </span>
        <input
          type="text"
          className="w-128 p-2 border-2 border-solid border-gray-200 rounded-lg"
          placeholder="Masukan nama barang..."
          value={name}
          onChange={(n) => setName(n.target.value)}
        />
      </div>

      {/* input SKU */}
      <div className="px-2 mt-4 relative flex flex-col gap-2">
        <span className="font-bold">
          SKU Barang:
        </span>
        <input
          type="text"
          className="w-128 p-2 border-2 border-solid border-gray-200 rounded-lg"
          placeholder="Masukan SKU..."
          value={sku}
          onChange={(n) => setSku(n.target.value)}
        />
      </div>

      {/* input jumlah stok */}
      <div className="px-2 mt-4 relative flex flex-col gap-2">
        <span className="font-bold">
          Jumlah Stok:
        </span>
        <input
          type="number"
          className="w-128 p-2 border-2 border-solid border-gray-200 rounded-lg"
          placeholder="Masukan jumlah stok..."
          value={qty}
          onChange={(n) => setQty(n.target.value)}
        />
      </div>


      <button className="flex items-center py-2 px-4 mx-2 mt-4 gap-2 cursor-pointer bg-sky-950 text-white font-semibold border rounded-lg hover:bg-white hover:text-sky-950 hover:border hover:rounded-lg hover:border-sky-950 transition-all">
        <span>
          Tambah Barang
        </span>
      </button>
    </form>
  );
}

export default NewStock;