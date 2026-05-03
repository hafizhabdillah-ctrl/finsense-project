import React from 'react';
import InputPos from '../../Components/Features/Pos/InputPos';
import FrequentlyPos from '../../Components/Features/Pos/FrequentlyPos';
import CartPos from '../../Components/Features/Pos/CartPos';

function PosPage() {
  return (
    <div className="py-2 px-4 h-full flex flex-col">

      {/* Header */}
      <h1 className="p-2 text-gray-700 text-2xl font-bold">POS Terminal</h1>


      <div className="flex flex-1 overflow-hidden p-4 gap-4">
        <div className="flex-2 flex flex-col gap-4">

          {/* Input Voice */}
          <div className="flex-1">
            <InputPos />
          </div>

          {/* Produk sering dibeli */}
          <FrequentlyPos />
        </div>

        {/* Keranjang */}
        <div className="flex flex-col border border-gray-400 rounded-md">
          <CartPos />
        </div>

      </div>
    </div>
  );
}

export default PosPage;