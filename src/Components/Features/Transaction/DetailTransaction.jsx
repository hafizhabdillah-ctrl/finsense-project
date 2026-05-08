import React from 'react';
import { transactions, deleteTransaction } from '../../../utils/local/transaction';
import { useNavigate, useParams } from 'react-router-dom';

function DetailTransaction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const transaction = transactions.find((s) => s.id === Number(id));

  if (!transaction) {
    return (
      <div className="p-6">
        <p className="text-red-500 font-bold">Data transaksi tidak ditemukan!</p>
        <button onClick={() => navigate('/transaction')} className="mt-4 underline">Kembali</button>
      </div>
    );
  }

  const onDeleteHandler = () => {
    const isConfirmed = window.confirm(`Konfirmasi hapus ${transaction.description}?`);

    if (isConfirmed) {
      deleteTransaction(transaction.id);
      navigate('/transaction');
    }
  };

  return (
    <div className="p-6">

      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800">Detail Transaksi</h1>
      <p className="mb-2 mt-2 text-sm text-gray-500">ID Transaksi: {id}</p>

      {/* Tabel detail */}
      <div className="grid grid-cols-2 gap-4 border-t pt-4">
        <p className="font-semibold text-gray-600">Tanggal:</p>
        <p>{transaction.date}</p>

        <p className="font-semibold text-gray-600">Kategori:</p>
        <p>{transaction.category}</p>

        <p className="font-semibold text-gray-600">Keterangan:</p>
        <p>{transaction.description}</p>

        <p className="font-semibold text-gray-600">Nominal:</p>
        <p>{transaction.amount}</p>

        <p className="font-semibold text-gray-600">Tipe:</p>
        <p>{transaction.type}</p>
      </div>

      {/* Button */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate(`/transaction/edittransaction/${id}`)}
          className="flex items-center gap-2 mt-4 cursor-pointer bg-sky-950 p-2 text-white font-semibold border rounded-lg hover:bg-white hover:text-sky-950 hover:border hover:rounded-lg hover:border-sky-950 transition-all">
          <span>
            Edit
          </span>
        </button>

        <button
          onClick={onDeleteHandler}
          className="flex items-center gap-2 mt-4 cursor-pointer bg-red-900 p-2 text-white font-semibold border rounded-lg hover:bg-white hover:text-red-900 hover:border hover:rounded-lg hover:border-red-900 transition-all">
          <span>
            Hapus
          </span>
        </button>
      </div>
    </div>
  );
}

export default DetailTransaction;