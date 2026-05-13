import React, { useState, useEffect } from 'react';
import { getProducts } from '../../../services/productService';
import { useCart } from '../../../hooks/useCart';
import { FaMicrophone, FaSearch } from 'react-icons/fa';

function InputPos() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (query.length > 1) {
      setFiltered(
        products.filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase()),
        ),
      );
    } else {
      setFiltered([]);
    }
  }, [query, products]);

  const handleAdd = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price || 0,
      qty: 1,
    });
    setQuery('');
    setFiltered([]);
  };

  return (
    <div className='flex flex-col items-center py-4 gap-4'>
      <div className='relative w-full max-w-md'>
        <input
          type='text'
          placeholder='Cari produk...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className='w-full p-3 border border-gray-300 rounded-lg'
        />
        <FaSearch className='absolute right-3 top-4 text-gray-400' />
        {filtered.length > 0 && (
          <ul className='absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-auto'>
            {filtered.map((p) => (
              <li
                key={p.id}
                onClick={() => handleAdd(p)}
                className='p-2 hover:bg-gray-100 cursor-pointer flex justify-between'
              >
                <span>{p.name}</span>
                <span>Rp {p.price}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button className='flex bg-sky-950 p-5 border rounded-xl text-white cursor-pointer hover:bg-white hover:text-sky-950 transition-all'>
        <FaMicrophone size={28} />
      </button>
      <p className='text-gray-400 text-sm'>
        Tekan mikrofon untuk perintah suara
      </p>
    </div>
  );
}

export default InputPos;
