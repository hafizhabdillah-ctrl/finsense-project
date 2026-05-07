import React from 'react';
import { logs, deleteLog } from '../../../utils/local/log';
import { useNavigate, useParams } from 'react-router-dom';

function DetailLog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const log = logs.find((s) => s.id === Number(id));

  const onDeleteHandler = () => {
    deleteLog(log.id);
    navigate('/log');
  };

  return (
    <div className="p-6">

      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800">Detail Log</h1>
      <p className="mb-2 mt-2 text-sm text-gray-500">ID Log: {id}</p>

      {/* Tabel detail */}
      <div className="grid grid-cols-2 gap-4 border-t pt-4">
        <p className="font-semibold text-gray-600">Waktu:</p>
        <p>{log.waktu}</p>

        <p className="font-semibold text-gray-600">Nama Produk:</p>
        <p>{log.produk}</p>

        <p className="font-semibold text-gray-600">SKU:</p>
        <p>{log.sku}</p>

        <p className="font-semibold text-gray-600">Tipe:</p>
        <p>{log.tipe}</p>

        <p className="font-semibold text-gray-600">Jumlah:</p>
        <p>{log.jumlah}</p>

        <p className="font-semibold text-gray-600">Oleh:</p>
        <p>{log.oleh}</p>

        <p className="font-semibold text-gray-600">Status:</p>
        <p>{log.status}</p>
      </div>

      {/* Button */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate(`/log/editlog/${id}`)}
          className="flex items-center gap-2 mt-4 cursor-pointer bg-sky-950 p-2 text-white font-semibold border rounded-lg hover:bg-white hover:text-sky-950 hover:border hover:rounded-lg hover:border-sky-950 transition-all">
          <span>
            Edit
          </span>
        </button>

        <button
          onClick={onDeleteHandler}
          className="flex items-center gap-2 mt-4 cursor-pointer bg-red-900 p-2 text-white font-semibold border rounded-lg hover:bg-white hover:text-red-900 hover:border hover:rounded-lg hover:border-red-900 transition-all">
          <span>
            Hapus
          </span>
        </button>
      </div>
    </div>
  );
}

export default DetailLog;