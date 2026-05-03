import React from 'react';

function StatDebt() {
  return (
    <div>

      {/* Display stat */}
      <div className="flex w-64 flex flex-col justify-between bg-white p-4 border rounded-md border-gray-300 shadow-sm">
        <p className="text-md text-gray-500 font-semibold mb-2">
          TOTAL PIUTANG AKTIF
        </p>
        <p className="text-sky-950 font-bold text-2xl mb-3">
          Rp. 500.000
        </p>
        <p className='text-xs text-green-500 font-normal flex gap-1'>
          <span>
            &#8631;
          </span>
          <span>
            Turun 12% dibanding bulan lalu
          </span>
        </p>
      </div>
    </div>
  );
}

export default StatDebt;