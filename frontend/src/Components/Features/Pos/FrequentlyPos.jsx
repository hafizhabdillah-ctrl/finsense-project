import React from 'react';

function FrequentlyPos() {
  const products = [
    { id: 1, name: 'Beras 1kg', price: 10000, quantity: 1 },
    { id: 2, name: 'Garam 500gr', price: 6000, quantity: 2 },
    { id: 3, name: 'Gula 1kg', price: 15000, quantity: 1 },
    { id: 4, name: 'Telur 1kg', price: 15000, quantity: 1 },
    { id: 5, name: 'Ayam 1kg', price: 5000, quantity: 2 },
  ];

  return (
    <div className="mt-20">
      <p className="text-lg font-semibold px-4 py-2 mb-4">Produk Sering Dibeli</p>

      <div className="flex px-2 gap-4 justify-around">
        {products.map((item) => {
          return (
            <div
              key={item.id}
              className="w-56 flex flex-col justify-between p-4 border rounded-xl text-sky-950 border-gray-400"
            >
              <div className="font-semibold">
                {item.name}
              </div>
              <div>
                {item.quantity}x
              </div>
              <div>
                Rp. {item.price}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FrequentlyPos;