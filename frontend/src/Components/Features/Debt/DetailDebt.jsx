import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDebts } from '../../../hooks/useDebts';
import Swal from 'sweetalert2';

function DetailDebt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchDebtById, removeDebt } = useDebts();
  const [debt, setDebt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('ID dari params:', id);
    const load = async () => {
      try {
        const data = await fetchDebtById(id);
        setDebt(data);
      } catch (err) {
        navigate('/debts');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, fetchDebtById, navigate]);

  const onDeleteHandler = async () => {
    const result = await Swal.fire({
      title: 'Hapus Hutang?',
      text: `Yakin ingin menghapus hutang "${debt?.customer_name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7f1d1d',
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
    });
    if (result.isConfirmed) {
      const success = await removeDebt(id);
      if (success) navigate('/debts');
    }
  };

  if (loading) return <div className='p-6'>Memuat detail...</div>;
  if (!debt) return <div className='p-6'>Hutang tidak ditemukan</div>;

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold text-gray-800'>Detail Hutang</h1>
      <p className='mb-2 mt-2 text-sm text-gray-500'>ID Hutang: {debt.id}</p>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-2 border-t pt-4 mt-2'>
        <p className='font-semibold text-gray-600'>Nama Orang:</p>
        <p>{debt.customer_name}</p>
        <p className='font-semibold text-gray-600'>Total Hutang:</p>
        <p>Rp {debt.total_debt?.toLocaleString()}</p>
        <p className='font-semibold text-gray-600'>Jatuh Tempo:</p>
        <p>{new Date(debt.due_date).toLocaleDateString('id-ID')}</p>
        <p className='font-semibold text-gray-600'>Status:</p>
        <p>{debt.status}</p>
      </div>
      <div className='flex gap-4'>
        <button
          onClick={() => navigate(`/debts/edit/${id}`)}
          className='flex items-center gap-2 mt-4 cursor-pointer bg-sky-950 p-2 text-white font-semibold border rounded-lg hover:bg-white hover:text-sky-950 transition-all'
        >
          Edit
        </button>
        <button
          onClick={onDeleteHandler}
          className='flex items-center gap-2 mt-4 cursor-pointer bg-red-900 p-2 text-white font-semibold border rounded-lg hover:bg-white hover:text-red-900 transition-all'
        >
          Hapus
        </button>
      </div>
    </div>
  );
}

export default DetailDebt;
