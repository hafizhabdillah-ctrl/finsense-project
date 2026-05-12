import React, { useEffect, useState } from 'react';
import { transactions, updateTransaction } from '../../../utils/local/transaction';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

function EditTransaction() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    const transactionToEdit = transactions.find((s) => s.id == id);
    if (transactionToEdit) {
      setDate(transactionToEdit.date);
      setCategory(transactionToEdit.category);
      setDescription(transactionToEdit.description);
      setAmount(transactionToEdit.amount);
      setType(transactionToEdit.type);
    }
  }, [id]);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    const isAmountInvalid = amount === '' || amount === null || amount === undefined;

    if (date.trim() === '' || category.trim() === '' || description.trim() === '' || isAmountInvalid || type.trim() === '') {
      event.preventDefault();
      Swal.fire({
        title: 'Data Belum Lengkap',
        text: 'Mohon lengkapi semua data sebelum mengubah',
        icon: 'warning',
        confirmButtonColor: '#0c4a6e',
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

    // logika Konfirmasi
    Swal.fire({
      title: 'Konfirmasi Edit Transaksi?',
      text: `Anda akan mengubah data Transaksi dengan ID: ${id}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0c4a6e',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Konfirmasi',
      cancelButtonText: 'Batal',
    }).then((result) => {

      // Hanya jalankan kode di bawah jika user menekan "Ya"
      if (result.isConfirmed) {

        // Eksekusi Update
        updateTransaction({
          id: Number(id),
          date,
          category,
          description,
          amount: Number(amount),
          type,
          source: 'manual',
        });

        navigate(`/transactions/${id}`);

        // Tampilkan Pesan Sukses
        Swal.fire({
          title: 'Sukses',
          text: 'Data transaksi telah diperbarui',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <form className="p-6" onSubmit={onSubmitHandler}>

      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800">Edit Transaksi</h1>
      <p className="mb-2 mt-2 text-sm text-gray-500">ID Transaksi: {id}</p>

      <div className="grid grid-cols-2 gap-4 border-t pt-4">
        <p className="flex items-center font-semibold text-gray-600">Tanggal:</p>
        <input
          type="date"
          className="p-2 border border-gray-400 rounded"
          value={date}
          onChange={(n) => setDate(n.target.value)}
        />

        <p className="flex items-center font-semibold text-gray-600">Kategori:</p>
        <select
          className="p-2 border border-gray-400 rounded"
          value={category}
          onChange={(n) => setCategory(n.target.value)}
        >
          <option>Penjualan</option>
          <option>Restok</option>
          <option>Operasional</option>
          <option>Gaji Karyawan</option>
        </select>

        <p className="flex items-center font-semibold text-gray-600">Keterangan:</p>
        <input
          className="p-2 border border-gray-400 rounded"
          value={description}
          onChange={(n) => setDescription(n.target.value)}
        />

        <p className="flex items-center font-semibold text-gray-600">Nominal:</p>
        <input
          type="number"
          className="p-2 border border-gray-400 rounded"
          value={amount}
          onChange={(n) => setAmount(n.target.value)}
        />

        <p className="flex items-center font-semibold text-gray-600">Tipe:</p>
        <select
          className="p-2 border border-gray-400 rounded"
          value={type}
          onChange={(n) => setType(n.target.value)}
        >
          <option>Masuk</option>
          <option>Keluar</option>
        </select>
      </div>

      {/* Button */}
      <div className="flex gap-4 mt-4">
        <button
          type="submit"
          className="flex items-center gap-2 mt-4 cursor-pointer bg-sky-950 p-2 text-white font-semibold border rounded-lg hover:bg-white hover:text-sky-950 hover:border hover:rounded-lg hover:border-sky-950 transition-all">
          <span>
            Konfirmasi
          </span>
        </button>
      </div>
    </form>
  );
}

export default EditTransaction;