import React from 'react';
import { useNavigate }  from 'react-router-dom';

function NewItem() {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Tambah Barang',
      description: 'Masukkan barang yang baru tiba atau restock',
      link: '/new/newstock'
    },
    {
      title: 'Tambah Log POS Terminal',
      description: 'Catat aktivitas terminal POS secara manual',
      link: '/new/newpos'
    },
    {
      title: 'Tambah Piutang',
      description: 'Catat hutang atau piutang pelanggan',
      link: '/new/newdebt'
    },
    {
      title: 'Tambah Log Barang',
      description: 'Catat riwayat pergerakan dan penyesuaian',
      link: '/new/newlog'
    }
  ];

  return (
    <div className="p-2">

      {/* Container */}
      <div className="flex flex-col gap-4 w-1/2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.link)}
            className="flex items-center p-4 bg-sky-950 border rounded-md hover:text-sky-950 hover:shadow-md hover:bg-white hover:border-sky-950 transition-all cursor-pointer group"
          >
            {/* Teks Tengah */}
            <span className="flex flex-row items-center gap-2 font-semibold">
              <h3 className="text-lg text-white group-hover:text-sky-950">{item.title}</h3>
              <p className="text-md text-sky-950">&gt; {item.description}</p>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default NewItem;