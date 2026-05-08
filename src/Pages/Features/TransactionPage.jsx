import React from 'react';
import StatTransaction from '../../Components/Features/Transaction/StatTransaction';
import TableTransaction from '../../Components/Features/Transaction/TableTransaction';
import SummaryTransaction from '../../Components/Features/Transaction/SummaryTransaction';

function TransactionPage() {
  return (
    <div className="py-2 px-4">

      {/* Header */}
      <h1 className="p-2 text-gray-700 text-2xl font-bold">Catatan keuangan</h1>

      <StatTransaction />

      <TableTransaction />

      <div className="bg-gray-200 mt-4">
        <hr className="border-t border-gray-300" />
      </div>

      {/* Header */}
      <h1 className="p-2 text-gray-700 text-2xl font-bold">Ringkasan Keuangan</h1>

      <SummaryTransaction />

    </div>
  );
}

export default TransactionPage;