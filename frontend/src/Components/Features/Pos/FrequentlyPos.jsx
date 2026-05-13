import React, { useState, useEffect } from 'react';
import { getProducts } from '../../../services/productService';
import { useCart } from '../../../hooks/useCart';
import Swal from 'sweetalert2';

function FrequentlyPos() {
  const [products, setProducts] = useState([]);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(res.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  const handleAdd = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: 1,
    });
    Swal.fire({
      icon: 'success',
      title: 'Berhasil',
      text: `${product.name} ditambahkan ke keranjang`,
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      window.location.reload(); // reload halaman setelah notifikasi
    });
  };

  return (
    <div className='mt-4'>
      <p className='text-lg font-semibold px-4 py-2 mb-4'>
        Produk Sering Dibeli
      </p>
      <div className='flex px-2 gap-4 justify-around flex-wrap'>
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => handleAdd(product)}
            className='w-56 flex flex-col justify-between p-4 border rounded-xl text-sky-950 border-gray-400 cursor-pointer hover:bg-gray-100 transition-all'
          >
            <div className='font-semibold'>{product.name}</div>
            <div>
              Stok: {product.stock} {product.unit || ''}
            </div>
            <div>Rp {product.price?.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FrequentlyPos;
