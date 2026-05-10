import React from 'react';
import { debts } from '../../../utils/local/debt';
import { deleteDebt } from '../../../utils/local/debt';
import { useNavigate, useParams } from 'react-router-dom';

function DetailDebt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const debt = debts.find((s) => s.id === Number(id));

  if (!debt) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Hutang Tidak Ditemukan</h1>
      </div>
    );
  };

  const onDeleteHandler = () => {
    const isConfirmed = window.confirm(`Konfirmasi hapus ${debt.name}?`);

    if (isConfirmed) {
      deleteDebt(debt.id);
      navigate('/debt');
    }
  };

  return (
    <div className="p-6">

      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800">Detail Hutang</h1>
      <p className="mb-2 mt-2 text-sm text-gray-500">ID Hutang: {id}</p>

      {/* Tabel detail */}
      <div className="grid grid-cols-2 gap-4 border-t pt-4">
        <p className="font-semibold text-gray-600">Nama Orang:</p>
        <p>{debt.name}</p>

        <p className="font-semibold text-gray-600">Total Hutang:</p>
        <p>{debt.hutang}</p>

        <p className="font-semibold text-gray-600">Jatuh Tempo:</p>
        <p>{debt.tempo}</p>

        <p className="font-semibold text-gray-600">Status:</p>
        <p>{debt.status}</p>

      </div>

      {/* Button */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate(`/debt/editdebt/${id}`)}
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

export default DetailDebt;