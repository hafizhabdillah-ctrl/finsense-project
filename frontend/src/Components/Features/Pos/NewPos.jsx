import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../hooks/useCart';
import Swal from 'sweetalert2';

function NewPos() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState('');

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (!name || !price || !qty) {
      Swal.fire('Perhatian', 'Lengkapi semua data', 'info');
      return;
    }
    // ID sementara menggunakan timestamp, karena produk baru belum ada di backend.
    // Tapi sebaiknya produk harus sudah ada di master produk.
    const tempId = Date.now();
    addItem({
      id: tempId,
      name,
      price: parseInt(price),
      qty: parseInt(qty),
    });
    Swal.fire('Sukses', 'Item ditambahkan ke keranjang', 'success');
    navigate('/pos');
  };

  return (
    <form className='py-2 px-4 max-w-2xl' onSubmit={onSubmitHandler}>
      {/* Header */}
      <h1 className='p-2 text-gray-700 text-2xl font-bold'>Tambah POS Baru</h1>

      {/* input nama barang */}
      <div className='px-2 mt-4 relative flex flex-col gap-2'>
        <span className='font-bold'>Nama Barang:</span>
        <input
          type='text'
          className='w-full p-2 border-2 border-solid border-gray-300 rounded-lg'
          placeholder='Masukan nama barang...'
          value={name}
          onChange={(n) => setName(n.target.value)}
        />
      </div>

      {/* input jumlah stok */}
      <div className='px-2 mt-4 relative flex flex-col gap-2'>
        <span className='font-bold'>Jumlah Barang:</span>
        <input
          type='number'
          className='w-full p-2 border-2 border-solid border-gray-300 rounded-lg'
          placeholder='Masukan jumlah Barang...'
          value={qty}
          onChange={(n) => setQty(n.target.value)}
        />
      </div>

      {/* input harga barang */}
      <div className='px-2 mt-4 relative flex flex-col gap-2'>
        <span className='font-bold'>Harga:</span>
        <input
          type='number'
          className='w-full p-2 border-2 border-solid border-gray-300 rounded-lg'
          placeholder='Masukan harga barang...'
          value={price}
          onChange={(n) => setPrice(n.target.value)}
        />
      </div>

      <button className='flex items-center py-2 px-4 mx-2 mt-4 gap-2 cursor-pointer bg-sky-950 text-white font-semibold border rounded-lg hover:bg-white hover:text-sky-950 hover:border hover:rounded-lg hover:border-sky-950 transition-all'>
        <span>Konfirmasi</span>
      </button>
    </form>
  );
}

export default NewPos;
