import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDebt } from '../../../utils/local/debt';

function NewDebt() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [hutang, setHutang] = useState('');
  const [tempo, setTempo] = useState('');

  function onSubmitHandler(event) {

    if (name.trim() === '' || hutang.trim() === '' || tempo.trim() === '') {
      event.preventDefault();
      alert('Mohon lengkapi semua data');
      return;
    };

    if (Number(hutang) < 0) {
      event.preventDefault();
      alert('Angka tidak boleh minus!');
      return;
    }

    event.preventDefault();
    addDebt({ name, hutang, tempo });
    navigate('/debt');
  }

  return (
    <form className="py-2 px-4" onSubmit={onSubmitHandler}>

      {/* Header */}
      <h1 className="p-2 text-gray-700 text-2xl font-bold">Tambah Piutang Baru</h1>

      {/* input nama orang */}
      <div className="px-2 mt-4 relative flex flex-col gap-2">
        <span className="font-bold">
          Nama Orang:
        </span>
        <input
          type="text"
          className="w-128 p-2 border-2 border-solid border-gray-200 rounded-lg"
          placeholder="Masukan nama barang..."
          value={name}
          onChange={(n) => setName(n.target.value)}
        />
      </div>

      {/* input total hutang */}
      <div className="px-2 mt-4 relative flex flex-col gap-2">
        <span className="font-bold">
          Total Hutang:
        </span>
        <input
          type="number"
          className="w-128 p-2 border-2 border-solid border-gray-200 rounded-lg"
          placeholder="Masukan jumlah hutang..."
          value={hutang}
          onChange={(n) => setHutang(n.target.value)}
        />
      </div>

      {/* input jatuh tempo */}
      <div className="px-2 mt-4 relative flex flex-col gap-2">
        <span className="font-bold">
          Jatuh Tempo:
        </span>
        <input
          type="date"
          className="w-128 p-2 border-2 border-solid border-gray-200 rounded-lg"
          placeholder="Masukan jatuh tempo..."
          value={tempo}
          onChange={(n) => setTempo(n.target.value)}
        />
      </div>

      <button className="flex items-center py-2 px-4 mx-2 mt-4 gap-2 cursor-pointer bg-sky-950 text-white font-semibold border rounded-lg hover:bg-white hover:text-sky-950 hover:border hover:rounded-lg hover:border-sky-950 transition-all">
        <span>
          Konfirmasi
        </span>
      </button>
    </form>
  );
}

export default NewDebt;