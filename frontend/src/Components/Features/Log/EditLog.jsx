import React, { useEffect, useState } from 'react';
import { logs, updateLog } from '../../../utils/local/log';
import { useNavigate, useParams } from 'react-router-dom';

function EditLog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [waktu, setWaktu] = useState('');
  const [produk, setProduk] = useState('');
  const [sku, setSku] = useState('');
  const [tipe, setTipe] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [oleh, setOleh] = useState('');
  const [status, setStatus] = useState('');


  useEffect(() => {
    const logToEdit = logs.find((s) => s.id === Number(id));
    if (logToEdit) {
      setWaktu(logToEdit.waktu);
      setProduk(logToEdit.produk);
      setSku(logToEdit.sku);
      setTipe(logToEdit.tipe);
      setJumlah(logToEdit.jumlah);
      setOleh(logToEdit.oleh);
      setStatus(logToEdit.status);
    }
  }, [id]);

  const format = `${waktu.replace('T', ' ')}:00`;

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if (waktu.trim() === '' || produk.trim() === '' || sku.trim() === '' || tipe.trim() === '' || jumlah === '' || oleh.trim() === '' || status === '') {
      alert('Mohon lengkapi semua data sebelum mengubah data');
      return;
    }

    updateLog({
      id: Number(id),
      waktu: format,
      produk,
      sku,
      tipe,
      jumlah: Number(jumlah),
      oleh,
      status,
    });

    alert('Log berhasil diperbarui');
    navigate(`/log/${id}`);
  };

  return (
    <form className="p-6" onSubmit={onSubmitHandler}>

      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800">Edit Log</h1>
      <p className="mb-2 mt-2 text-sm text-gray-500">ID Log: {id}</p>

      <div className="grid grid-cols-2 gap-4 border-t pt-4">
        <p className="flex items-center font-semibold text-gray-600">Waktu:</p>
        <input
          type="datetime-local"
          className="p-2 border border-gray-400 rounded"
          value={waktu}
          onChange={(n) => setWaktu(n.target.value)}
          required
        />

        <p className="flex items-center font-semibold text-gray-600">Nama Produk:</p>
        <input
          className="p-2 border border-gray-400 rounded"
          value={produk}
          onChange={(n) => setProduk(n.target.value)}
          required
        />

        <p className="flex items-center font-semibold text-gray-600">SKU:</p>
        <input
          className="p-2 border border-gray-400 rounded"
          value={sku}
          onChange={(n) => setSku(n.target.value)}
          required
        />

        <p className="flex items-center font-semibold text-gray-600">Tipe:</p>
        <select
          className="p-2 border border-gray-400 rounded"
          value={tipe}
          onChange={(n) => setTipe(n.target.value)}
          required
        >
          <option>Penyesuaian Manual</option>
          <option>Stok Masuk</option>
          <option>Stok Keluar</option>
        </select>

        <p className="flex items-center font-semibold text-gray-600">Jumlah:</p>
        <input
          className="p-2 border border-gray-400 rounded"
          value={jumlah}
          onChange={(n) => setJumlah(n.target.value)}
          required
        />

        <p className="flex items-center font-semibold text-gray-600">Oleh:</p>
        <select
          className="p-2 border border-gray-400 rounded"
          value={oleh}
          onChange={(n) => setOleh(n.target.value)}
          required
        >
          <option>Admin</option>
          <option>Kasir</option>
          <option>Gudang</option>
        </select>

        <p className="flex items-center font-semibold text-gray-600">Status:</p>
        <select
          className="p-2 border border-gray-400 rounded"
          value={status}
          onChange={(n) => setStatus(n.target.value)}
          required
        >
          <option>Selesai</option>
          <option>Menunggu audit</option>
        </select>
      </div>

      {/* Button */}
      <div className="flex gap-4 mt-4">
        <button
          type="submit"
          className="flex items-center gap-2 mt-4 cursor-pointer bg-sky-950 p-2 text-white font-semibold border rounded-lg hover:bg-white hover:text-sky-950 hover:border hover:rounded-lg hover:border-sky-950 transition-all">
          <span>
            Konfirmasi
          </span>
        </button>
      </div>
    </form>
  );
}

export default EditLog;