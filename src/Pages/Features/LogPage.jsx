import React from 'react';
import StatLog from '../../Components/Features/Log/StatLog';
import TableLog from '../../Components/Features/Log/TableLog';

function LogPage() {
  return (
    <div className="py-2 px-4">
      {/* Header */}
      <h1 className="p-2 text-gray-700 text-2xl font-bold mb-2">Log Barang</h1>

      <StatLog />

      <TableLog />

    </div>
  );
}

export default LogPage;