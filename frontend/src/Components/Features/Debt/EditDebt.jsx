import React, { useEffect, useState } from 'react';
import { debts, updateDebt } from '../../../utils/local/debt';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

function EditDebt() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [hutang, setHutang] = useState('');
  const [tempo, setTempo] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const debtToEdit = debts.find((s) => s.id === Number(id));
    if (debtToEdit) {
      setName(debtToEdit.name);
      setHutang(debtToEdit.hutang);
      setTempo(debtToEdit.tempo);
      setStatus(debtToEdit.status);
    }
  }, [id]);

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if (name.trim() === '' || hutang.trim() === '' || tempo.trim() === '') {
      event.preventDefault();
      Swal.fire({
        title: 'Data Belum Lengkap',
        text: 'Mohon lengkapi semua data sebelum mengubah',
        icon: 'warning',
        confirmButtonColor: '#0c4a6e',
      });
      return;
    };

    if (Number(hutang) < 0) {
      event.preventDefault();
      Swal.fire({
        title: 'Invalid Data',
        text: 'Mohon masukkan angka positif untuk Total Hutang',
        icon: 'warning',
        confirmButtonColor: '#0c4a6e',
      });
      return;
    }

    Swal.fire({
      title: 'Konfirmasi Edit Hutang?',
      text: `Anda akan mengubah data hutang dengan ID: ${id}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0c4a6e',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Konfirmasi',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {

        updateDebt({
          id: Number(id),
          name,
          hutang,
          tempo,
          status,
        });

        navigate(`/debt/${id}`);
        Swal.fire({
          title: 'Sukses',
          text: 'Data hutang telah diperbarui',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <form className="p-6" onSubmit={onSubmitHandler}>

      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800">Edit Hutang</h1>
      <p className="mb-2 mt-2 text-sm text-gray-500">ID Hutang: {id}</p>

      {/* Tabel detail */}
      <div className="grid grid-cols-2 gap-4 border-t pt-4">
        <p className="flex items-center font-semibold text-gray-600">Nama Orang:</p>
        <input
          className="p-2 border border-gray-400 rounded"
          value={name}
          onChange={(n) => setName(n.target.value)}
          required
        />

        <p className="flex items-center font-semibold text-gray-600">Total Hutang:</p>
        <input
          type='number'
          className="p-2 border border-gray-400 rounded"
          value={hutang}
          onChange={(n) => setHutang(n.target.value)}
          required
        />

        <p className="flex items-center font-semibold text-gray-600">Jatuh Tempo:</p>
        <input
          className="p-2 border border-gray-400 rounded"
          value={tempo}
          type='date'
          onChange={(n) => setTempo(n.target.value)}
          required
        />

        <p className="flex items-center font-semibold text-gray-600">Status:</p>
        <select
          className="p-2 border border-gray-400 rounded bg-white cursor-pointer"
          value={status}
          onChange={(n) => setStatus(n.target.value)}
          required
        >
          <option>Belum Lunas</option>
          <option>Lunas</option>
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

export default EditDebt;