import React, { useEffect, useState } from 'react';
import api from '../../../services/api';

const LakuDashboard = () => {
  const [topProducts, setTopProducts] = useState([]);
  useEffect(() => {
    const fetchTop = async () => {
      try {
        const res = await api.get('/ai/predict-top-products');
        setTopProducts(res.data.top_products);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTop();
  }, []);

  return (
    <div className='bg-white p-4 rounded shadow'>
      <h2 className='font-bold text-lg mb-2'>
        Prediksi Produk Terlaris Hari Ini
      </h2>
      <ul>
        {topProducts.map((p) => (
          <li key={p.product} className='flex justify-between py-1 border-b'>
            <span>{p.product}</span>
            <span
              className={
                p.is_top_seller ? 'text-green-600 font-bold' : 'text-gray-400'
              }
            >
              {p.is_top_seller ? '✅ Top' : '❌'} (
              {Math.round(p.probability * 100)}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default LakuDashboard;
