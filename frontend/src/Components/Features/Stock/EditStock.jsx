import React, { useEffect, useState } from 'react';
import { stocks, updateStock } from '../../../utils/local/stock';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

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

    if (name.trim() === '' || sku.trim() === '' || qty === '') {
      event.preventDefault();
      Swal.fire({
        title: 'Data Belum Lengkap',
        text: 'Mohon lengkapi semua data sebelum mengubah',
        icon: 'warning',
        confirmButtonColor: '#0c4a6e',
      });
      return;
    }

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
      title: 'Konfirmasi Edit Stok?',
      text: `Anda akan mengubah data stok dengan ID: ${id}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0c4a6e',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Konfirmasi',
      cancelButtonText: 'Batal',
    }).then((result) => {

      if (result.isConfirmed) {

        updateStock({
          id: Number(id),
          name,
          sku,
          qty,
        });

        navigate(`/stock/${id}`);

        Swal.fire({
          title: 'Berhasil!',
          text: 'Data stok telah diperbarui',
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
      <h1 className="text-2xl font-bold text-gray-800">Edit Produk</h1>
      <p className="mb-2 mt-2 text-sm text-gray-500">ID Produk: {id}</p>

      <div className="grid grid-cols-2 gap-4 border-t pt-4">
        <p className="flex items-center font-semibold text-gray-600">Nama Produk:</p>
        <input
          className="p-2 border border-gray-400 rounded"
          value={name}
          onChange={(n) => setName(n.target.value)}
        />

        <p className="flex items-center font-semibold text-gray-600">SKU:</p>
        <input
          className="p-2 border border-gray-400 rounded"
          value={sku}
          onChange={(n) => setSku(n.target.value)}
        />

        <p className="flex items-center font-semibold text-gray-600">Jumlah Stok:</p>
        <input
          type="number"
          className="p-2 border border-gray-400 rounded"
          value={qty}
          onChange={(n) => setQty(n.target.value)}
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