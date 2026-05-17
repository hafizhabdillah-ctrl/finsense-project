import React from 'react';
import { useCart } from '../../../hooks/useCart';
import { createTransaction } from '../../../services/transactionService';
import { updateStock } from '../../../services/productService';
import Swal from 'sweetalert2';

function CartPos() {
  const { cart, removeItem, updateItem, emptyCart } = useCart();
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const onDeleteHandler = (item) => {
    Swal.fire({
      title: 'Hapus Item?',
      text: `Yakin ingin menghapus ${item.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) removeItem(item.id);
    });
  };

  const onCheckout = async () => {
    if (cart.length === 0) {
      Swal.fire('Keranjang kosong', 'Tambahkan produk terlebih dahulu', 'info');
      return;
    }
    const confirm = await Swal.fire({
      title: 'Konfirmasi Transaksi',
      text: `Total Rp ${subtotal.toLocaleString()}. Lanjutkan?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, proses',
    });
    if (!confirm.isConfirmed) return;

    try {
      const transactionPayload = {
        category_id: 1,
        type: 'income',
        amount: subtotal,
        description: `Penjualan POS - ${cart.length} item`,
        transaction_date: new Date().toISOString(),
        source: 'ai',
      };
      await createTransaction(transactionPayload);

      for (let item of cart) {
        await updateStock(item.id, {
          quantity: item.qty,
          type: 'out',
          note: 'Penjualan POS',
        });
      }

      Swal.fire('Sukses', 'Transaksi berhasil diproses', 'success');
      emptyCart();
    } catch (err) {
      Swal.fire(
        'Gagal',
        err.response?.data?.error || 'Terjadi kesalahan',
        'error',
      );
    }
  };

  return (
    // <div className='flex flex-col p-2 w-96 h-190'>
    //   <h1 className='font-semibold text-xl text-sky-950 mb-4 flex-shrink-0'>
    //     Keranjang
    //   </h1>
    //   <div className='flex flex-col gap-2 flex-1 overflow-y-auto min-h-0 max-h-[calc(100vh-300px)]'>
    //     {cart.length === 0 ? (
    //       <p className='text-gray-500 text-center py-4'>Keranjang kosong</p>
    //     ) : (
    //       cart.map((item) => (
    //         <div
    //           key={item.id}
    //           className='my-2 justify-between items-center border-b border-gray-300'
    //         >
    //           <div className='flex justify-between font-semibold text-lg'>
    //             {item.name}
    //           </div>
    //           <div className='text-gray-500 flex justify-between items-center'>
    //             <div className='flex items-center gap-2'>
    //               <span>Rp {item.price.toLocaleString()}</span>
    //               <input
    //                 type='number'
    //                 min='1'
    //                 value={item.qty}
    //                 onChange={(e) =>
    //                   updateItem(item.id, parseInt(e.target.value) || 1)
    //                 }
    //                 className='w-16 p-1 border rounded'
    //               />
    //             </div>
    //             <div className='flex gap-2'>
    //               <span className='text-sky-950 font-bold'>
    //                 Rp {(item.price * item.qty).toLocaleString()}
    //               </span>
    //               <button
    //                 onClick={() => onDeleteHandler(item)}
    //                 className='text-red-800 cursor-pointer'
    //               >
    //                 X
    //               </button>
    //             </div>
    //           </div>
    //         </div>
    //       ))
    //     )}
    //   </div>
    //   <div className='mt-auto border-t border-gray-400 flex-shrink-0 pt-2'>
    //     <div className='flex justify-between p-1'>
    //       <span className='text-gray-500'>Subtotal</span>
    //       <span className='font-bold text-lg text-sky-950'>
    //         Rp {subtotal.toLocaleString()}
    //       </span>
    //     </div>
    //     <button
    //       onClick={onCheckout}
    //       className='w-full flex items-center justify-center mt-2 bg-orange-500 hover:bg-orange-600 transition-all text-white font-bold p-3 rounded-lg cursor-pointer'
    //     >
    //       Konfirmasi
    //     </button>
    //   </div>
    // </div>
    <div className='flex flex-col p-2 h-full'>
      <h1 className='font-semibold text-xl text-sky-950 mb-2'>Keranjang</h1>
      <div className='flex flex-col gap-2 max-h-96 overflow-y-auto flex-1 mt-2'>
        {cart.length === 0 ? (
          <p className='text-gray-500 text-center py-8'>Keranjang kosong</p>
        ) : (
          cart.map((item) => (
            <div key={item.id} className='border-b pb-2'>
              <div className='flex justify-between font-semibold'>
                {item.name}
              </div>
              <div className='flex flex-wrap justify-between items-center gap-2 text-gray-500'>
                <div className='flex items-center gap-4 mt-2'>
                  <span>Rp {item.price.toLocaleString()}</span>
                  <input
                    type='number'
                    min='1'
                    value={item.qty}
                    onChange={(e) =>
                      updateItem(item.id, parseInt(e.target.value) || 1)
                    }
                    className='w-16 p-1 border rounded'
                  />
                </div>
                <div className='flex gap-2'>
                  <span className='font-bold text-sky-950'>
                    Rp {(item.price * item.qty).toLocaleString()}
                  </span>
                  <button
                    onClick={() => onDeleteHandler(item)}
                    className='text-red-800 cursor-pointer'
                  >
                    X
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className='mt-auto pt-2 border-t'>
        <div className='flex justify-between'>
          <span className='text-gray-500'>Subtotal</span>
          <span className='font-bold text-lg'>
            Rp {subtotal.toLocaleString()}
          </span>
        </div>
        <button
          onClick={onCheckout}
          className='w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg mt-2'
        >
          Konfirmasi
        </button>
      </div>
    </div>
  );
}

export default CartPos;
