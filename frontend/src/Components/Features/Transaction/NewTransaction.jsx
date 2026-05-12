import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addTransaction } from '../../../utils/local/transaction';
import Swal from 'sweetalert2';

function NewTransaction() {
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('Penjualan');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Masuk');

  function onSubmitHandler(event) {
    event.preventDefault();
    if (date.trim() === '' || category.trim() === '' || description.trim() === '' || amount.trim() === '' || type.trim() === '') {
      event.preventDefault();
      Swal.fire({
        title: 'Mohon isi seluruh data',
        icon: 'info',
      });
      return;
    }

    if (Number(amount) < 0) {
      event.preventDefault();
      Swal.fire({
        title: 'Invalid Data',
        text: 'Mohon masukkan angka positif untuk Nominal',
        icon: 'warning',
        confirmButtonColor: '#0c4a6e',
      });
      return;
    }

    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Sukses',
      text: 'Transaksi berhasil ditambahkan',
      showConfirmButton: false,
      timer: 1500
    });

    addTransaction({
      date,
      category,
      description,
      amount,
      type,
      source: 'manual',
    });

    navigate('/transactions');
  }

  return (
    <form className="py-2 px-4" onSubmit={onSubmitHandler}>

      {/* Header */}
      <h1 className="p-2 text-gray-700 text-2xl font-bold">Tambah Transaksi</h1>

      <div className="px-2 mt-4 relative flex flex-col gap-2">
        <span className="font-bold">
          Waktu:
        </span>
        <input
          type="date"
          className="w-128 p-2 border-2 border-solid border-gray-200 rounded-lg"
          placeholder="Masukan waktu..."
          value={date}
          onChange={(n) => setDate(n.target.value)}
        />
      </div>

      <div className="px-2 mt-4 relative flex flex-col gap-2">
        <span className="font-bold">
          Ketegori:
        </span>
        <select
          type="text"
          className="w-128 p-2 border-2 border-solid border-gray-200 rounded-lg"
          placeholder="Masukan kategori..."
          value={category}
          onChange={(n) => setCategory(n.target.value)}
        >
          <option>Penjualan</option>
          <option>Restok</option>
          <option>Operasional</option>
          <option>Gaji Karyawan</option>
        </select>
      </div>

      <div className="px-2 mt-4 relative flex flex-col gap-2">
        <span className="font-bold">
          Keterangan:
        </span>
        <input
          type="text"
          className="w-128 p-2 border-2 border-solid border-gray-200 rounded-lg"
          placeholder="Masukan keterangan..."
          value={description}
          onChange={(n) => setDescription(n.target.value)}
        />
      </div>

      <div className="px-2 mt-4 relative flex flex-col gap-2">
        <span className="font-bold">
          Nominal:
        </span>
        <input
          type="number"
          className="w-128 p-2 border-2 border-solid border-gray-200 rounded-lg"
          placeholder="Masukan tipe..."
          value={amount}
          onChange={(n) => setAmount(n.target.value)}
        />
      </div>

      <div className="px-2 mt-4 relative flex flex-col gap-2">
        <span className="font-bold">
          Tipe:
        </span>
        <select
          className="w-128 p-2 border-2 border-solid border-gray-200 rounded-lg"
          placeholder="Masukan tipe..."
          value={type}
          onChange={(n) => setType(n.target.value)}
        >
          <option>Masuk</option>
          <option>Keluar</option>
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

export default NewTransaction;