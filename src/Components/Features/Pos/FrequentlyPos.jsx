import React from 'react';

function FrequentlyPos() {
  const products = [
    { id: 1, name: 'Ayam Geprek', price: 10000, quantity: 1 },
    { id: 2, name: 'Es Teh', price: 6000, quantity: 2 },
    { id: 3, name: 'Nasi Goreng', price: 15000, quantity: 1 },
    { id: 4, name: 'Ayam Katsu', price: 15000, quantity: 1 },
    { id: 5, name: 'Es Kopi', price: 5000, quantity: 2 },
  ];

  return (
    <div>
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