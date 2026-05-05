import React from 'react';
import { stocks } from '../../../utils/local/stock';
import { deleteStock } from '../../../utils/local/stock.js';
import { useNavigate, useParams } from 'react-router-dom';

function DetailStock() {
  const { id } = useParams();
  const navigate = useNavigate();
  const stock = stocks.find((s) => s.id === Number(id));

  if (!stock) {
    return <div>Barang tidak ditemukan.</div>;
  }

  const onDeleteHandler = () => {
    const isConfirmed = window.confirm(`Konfirmasi hapus ${stock.name}?`);

    if (isConfirmed) {
      deleteStock(stock.id);
      navigate('/stock');
    }
  };

  return (
    <div className="p-6">

      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800">Detail Produk</h1>
      <p className="mb-2 mt-2 text-sm text-gray-500">ID Barang: {id}</p>

      {/* Tabel detail */}
      <div className="grid grid-cols-2 gap-4 border-t pt-4">
        <p className="font-semibold text-gray-600">Nama Produk:</p>
        <p>{stock.name}</p>

        <p className="font-semibold text-gray-600">SKU:</p>
        <p>{stock.sku}</p>

        <p className="font-semibold text-gray-600">Jumlah Stok:</p>
        <p>{stock.qty}</p>

        <p className="font-semibold text-gray-600">Status:</p>
        <span className={`font-bold ${stock.status === 'Aman' ? 'text-green-600' : 'text-red-600'}`}>
          {stock.status}
        </span>
      </div>

      {/* Button */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate(`/stock/editstock/${id}`)}
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

export default DetailStock;