import React, { useEffect, useState } from 'react';
import { stocks, updateStock } from '../../../utils/local/stock';
import { useNavigate, useParams } from 'react-router-dom';

function EditStock() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [qty, setQty] = useState('');

  useEffect(() => {
    const stockToEdit = stocks.find((s) => s.id === Number(id));
    if (stockToEdit) {
      setName(stockToEdit.name);
      setSku(stockToEdit.sku);
      setQty(stockToEdit.qty);
    }
  }, [id]);

  const onSubmitHandler = (event) => {
    event.preventDefault();

    updateStock({
      id: Number(id),
      name,
      sku,
      qty,
    });

    alert('Stok berhasil diperbarui');
    navigate(`/stock/${id}`);
  };

  return (
    <form className="p-6" onSubmit={onSubmitHandler}>

      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800">Edit Produk</h1>
      <p className="mb-2 mt-2 text-sm text-gray-500">ID Produk: {id}</p>

      <div className="grid grid-cols-2 gap-4 border-t pt-4">
        <p className="flex items-center font-semibold text-gray-600">Nama Produk:</p>
        <input
          className="p-2 border border-gray-400 rounded"
          value={name}
          onChange={(n) => setName(n.target.value)}
          required
        />

        <p className="flex items-center font-semibold text-gray-600">SKU:</p>
        <input
          className="p-2 border border-gray-400 rounded"
          value={sku}
          onChange={(n) => setSku(n.target.value)}
          required
        />

        <p className="flex items-center font-semibold text-gray-600">Jumlah Stok:</p>
        <input
          className="p-2 border border-gray-400 rounded"
          value={qty}
          onChange={(n) => setQty(n.target.value)}
          required
        />
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

export default EditStock;