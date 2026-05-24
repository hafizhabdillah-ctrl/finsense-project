import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebts } from '../../../hooks/useDebts';

function TableDebt({ searchTerm = '' }) {
  const navigate = useNavigate();
  const { debts, loading } = useDebts();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter debts berdasarkan searchTerm
  const filteredDebts = useMemo(() => {
    if (!searchTerm.trim()) return debts;
    const lowerSearch = searchTerm.toLowerCase();
    return debts.filter((debt) =>
      debt.customer_name?.toLowerCase().includes(lowerSearch),
    );
  }, [debts, searchTerm]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDebts.slice(indexOfFirstItem, indexOfLastItem);
  const totalItems = filteredDebts.length;
  const startRange = totalItems === 0 ? 0 : indexOfFirstItem + 1;
  const endRange = Math.min(indexOfLastItem, totalItems);

  const goToNextPage = () => {
    if (indexOfLastItem < totalItems) setCurrentPage(currentPage + 1);
  };
  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading) return <div className='p-4'>Memuat daftar hutang...</div>;

  return (
    <div className='overflow-x-auto'>
      <div className='min-w-[800px]'>
        <div className='bg-sky-950 p-2 flex w-full mt-4 text-white font-semibold'>
          <div className='flex-1 text-center'>No</div>
          <div className='flex-8 text-center'>Nama Pelanggan</div>
          <div className='flex-8 text-center'>Total Hutang</div>
          <div className='flex-8 text-center'>Jatuh Tempo</div>
          <div className='flex-8 text-center'>Status</div>
        </div>

        <div className='flex flex-col'>
          {currentItems.length === 0 ? (
            <div className='p-4 text-center text-gray-500'>
              {searchTerm ? 'Tidak ada hutang yang cocok' : 'Tidak ada hutang'}
            </div>
          ) : (
            currentItems.map((debt, idx) => (
              <div
                key={debt.id}
                onClick={() => navigate(`/debts/${debt.id}`)}
                className='flex items-center w-full p-2 border-b border-r border-l border-gray-300 cursor-pointer hover:bg-gray-300 transition-all'
              >
                <div className='flex-1 text-center text-gray-800 text-sm'>
                  {indexOfFirstItem + idx + 1}
                </div>
                <div className='flex-8 text-center text-gray-800 text-sm font-bold'>
                  {debt.customer_name}
                </div>
                <div className='flex-8 text-center text-gray-500 text-sm'>
                  Rp {debt.total_debt?.toLocaleString()}
                </div>
                <div className='flex-8 text-center text-gray-500 text-sm'>
                  {new Date(debt.due_date).toLocaleDateString('id-ID')}
                </div>
                <div className='flex-8 text-center text-gray-800 text-sm'>
                  {debt.status}
                </div>
              </div>
            ))
          )}

          <div className='p-2 border-t border-gray-200 flex justify-between'>
            <p className='text-sm text-gray-500'>
              Menampilkan {startRange}-{endRange} dari {totalItems} hutang
            </p>
            <div className='flex gap-2'>
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className={`px-3 py-1 text-sm border rounded-md font-medium transition-all ${
                  currentPage === 1
                    ? 'text-gray-300 border-gray-200'
                    : 'cursor-pointer text-gray-600 border-gray-300 hover:bg-white'
                }`}
              >
                Sebelumnya
              </button>
              <button
                onClick={goToNextPage}
                disabled={indexOfLastItem >= totalItems}
                className={`px-3 py-1 text-sm border rounded-md font-medium transition-all ${
                  indexOfLastItem >= totalItems
                    ? 'text-gray-300 border-gray-200'
                    : 'cursor-pointer text-gray-600 border-gray-300 hover:bg-white'
                }`}
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableDebt;
