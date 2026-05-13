import React, { useState, useEffect } from 'react';
import { carts, deleteCart } from '../../../utils/local/pos';
import Swal from 'sweetalert2';

function CartPos() {
  const [cartItems, setCartItems] = useState(carts);
  useEffect(() => {
    setCartItems([...carts]);
  }, []);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const onDeleteHandler = (item) => {

    Swal.fire({
      title: 'Hapus Transaksi?',
      text: `Apakah Anda yakin ingin menghapus "${item.name}"? Data yang dihapus tidak bisa dikembalikan.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7f1d1d',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {

        deleteCart(item.id);
        setCartItems(carts);

        Swal.fire({
          title: 'Sukses',
          text: `${item.name} telah berhasil dihapus.`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  return (
    <div className="flex flex-col p-2 w-96 h-190">

      {/* Header */}
      <h1 className="font-semibold text-xl text-sky-950 mb-4 flex-shrink-0">Keranjang</h1>

      {/* Map barang */}
      <div className="flex flex-col gap-2 flex-1 overflow-y-auto min-h-0 max-h-[calc(100vh-300px)]">
        {cartItems.length > 0 ? cartItems.map((item) => {
          const total = item.price * item.qty;
          return (
            <div
              key={item.id}
              className="my-2 justify-between items-center border-b border-gray-300"
            >
              {/* Nama produk */}
              <div className="flex justify-between font-semibold text-lg">
                {item.name}
              </div>

              {/* Harga dan jumlah */}
              <div className="text-gray-500 flex justify-between">
                {item.price} x {item.qty}

                {/* Total */}
                <div className="flex gap-2 relative bottom-4 text-sky-950 font-bold text-lg">
                  <span>
                    {total}
                  </span>
                  <button
                    onClick={() => onDeleteHandler(item)}
                    className="text-red-800 cursor-pointer">
                    X
                  </button>
                </div>
              </div>
            </div>
          );
        }) : <p className="text-gray-500 text-center py-4">Keranjang masih kosong</p>}
      </div>

      {/* Tombol konfirmasi */}
      <div className="mt-auto mt-2 border-t border-gray-400 flex-shrink-0">
        <div className="flex justify-between p-1">
          <span className="text-gray-500 font-md">
            Subtotal
          </span>
          <span className="font-bold text-lg text-sky-950">
            Rp {subtotal}
          </span>
        </div>
        <div className="w-full flex items-center justify-center mt-2 bg-orange-500 hover:bg-orange-600 transition-all text-white font-bold p-3 rounded-lg cursor-pointer">
          Konfirmasi
        </div>
      </div>
    </div>
  );
}

export default CartPos;