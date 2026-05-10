import React from 'react';
import StatDebt from '../../Components/Features/Debt/StatDebt';
import TableDebt from '../../Components/Features/Debt/TableDebt';

function Debtpage() {
  return (
    <div className="py-2 px-4">

      {/* Header */}
      <h1 className="p-2 text-gray-700 text-2xl font-bold mb-2">Hutang Pelanggan</h1>

      {/* Stat display */}
      <StatDebt />

      {/* Tabel debitur */}
      <TableDebt />


    </div>
  );
}

export default Debtpage;