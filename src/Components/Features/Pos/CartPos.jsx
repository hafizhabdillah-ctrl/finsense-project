import React from 'react';

function CartPos() {
  const products = [
    { id:1, name: 'Beras Premium', price: 10000, quantity: 2 },
    { id:2, name: 'Minyak Goreng', price: 15000, quantity: 1 },
    { id:3, name: 'Telur 1 kilogram', price: 15000, quantity: 2 },
  ];

  const subtotal = products.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="flex flex-col h-full p-2 overflow-y-auto w-96 ">

      {/* Header */}
      <h1 className="font-semibold text-xl text-sky-950 mb-4 flex-shrink-0">Keranjang</h1>

      {/* Map barang */}
      <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
        {products.map((item) =>{
          const total = item.price * item.quantity;
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
                {item.price} x {item.quantity}

                {/* Total */}
                <div className="relative bottom-4 text-sky-950 font-bold text-lg">
                  {total}
                </div>
              </div>
            </div>
          );
        })}
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