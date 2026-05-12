import { useState, useEffect, useCallback } from 'react';
import {
  getDebts,
  createDebt,
  updateDebt,
  deleteDebt,
  getDebtById,
} from '../services/debtService';
import Swal from 'sweetalert2';

export const useDebts = () => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch semua hutang
  const fetchDebts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getDebts();
      setDebts(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat data hutang');
      Swal.fire('Error', 'Gagal memuat data hutang', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch satu hutang by id
  const fetchDebtById = useCallback(async (id) => {
    try {
      const response = await getDebtById(id);
      return response.data;
    } catch (err) {
      console.error(
        'Fetch one debt error:',
        err.response?.status,
        err.response?.data,
      );
      const message =
        err.response?.data?.error || 'Data hutang tidak ditemukan';
      Swal.fire('Error', message, 'error');
      throw err;
    }
  }, []);
  // Tambah hutang
  const addDebt = useCallback(
    async (debtData) => {
      try {
        await createDebt(debtData);
        await fetchDebts(); // refresh list
        Swal.fire('Sukses', 'Hutang berhasil ditambahkan', 'success');
        return true;
      } catch (err) {
        Swal.fire(
          'Gagal',
          err.response?.data?.message || 'Gagal menambah hutang',
          'error',
        );
        return false;
      }
    },
    [fetchDebts],
  );

  // Update hutang
  const editDebt = useCallback(
    async (id, debtData) => {
      try {
        await updateDebt(id, debtData);
        await fetchDebts();
        Swal.fire('Sukses', 'Hutang berhasil diperbarui', 'success');
        return true;
      } catch (err) {
        Swal.fire(
          'Gagal',
          err.response?.data?.message || 'Gagal memperbarui hutang',
          'error',
        );
        return false;
      }
    },
    [fetchDebts],
  );

  // Hapus hutang
  const removeDebt = useCallback(
    async (id) => {
      try {
        await deleteDebt(id);
        await fetchDebts();
        Swal.fire('Sukses', 'Hutang berhasil dihapus', 'success');
        return true;
      } catch (err) {
        Swal.fire(
          'Gagal',
          err.response?.data?.message || 'Gagal menghapus hutang',
          'error',
        );
        return false;
      }
    },
    [fetchDebts],
  );

  useEffect(() => {
    fetchDebts();
  }, [fetchDebts]);

  return {
    debts,
    loading,
    error,
    fetchDebts,
    fetchDebtById,
    addDebt,
    editDebt,
    removeDebt,
  };
};
