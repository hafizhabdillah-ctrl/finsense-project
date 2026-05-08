import React, { useEffect, useState } from 'react';
import { transactions, updateTransaction } from '../../../utils/local/transaction';
import { useNavigate, useParams } from 'react-router-dom';

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

    if (date.trim() === '' || category.trim() === '' || description.trim() === '' || amount.trim() === '' || type.trim() === '') {
      alert('Mohon lengkapi semua data sebelum mengubah data');
      return;
    }

    updateTransaction({
      id: Number(id),
      date,
      category,
      description,
      amount: Number(amount),
      type,
      source: 'manual',
    });

    alert('Berhasil mengubah data transaksi');
    navigate(`/transaction/${id}`);
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
          required
        />

        <p className="flex items-center font-semibold text-gray-600">Kategori:</p>
        <select
          className="p-2 border border-gray-400 rounded"
          value={category}
          onChange={(n) => setCategory(n.target.value)}
          required
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
          required
        />

        <p className="flex items-center font-semibold text-gray-600">Nominal:</p>
        <input
          type="number"
          className="p-2 border border-gray-400 rounded"
          value={amount}
          onChange={(n) => setAmount(n.target.value)}
          required
        />

        <p className="flex items-center font-semibold text-gray-600">Tipe:</p>
        <select
          className="p-2 border border-gray-400 rounded"
          value={type}
          onChange={(n) => setType(n.target.value)}
          required
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