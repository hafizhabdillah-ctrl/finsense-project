import React from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';

function SearchBarTop({ keyword, keywordChange }) {

  return (
    <div className="relative flex items-center">
      <FaMagnifyingGlass className="absolute left-3 text-gray-500" size={20} />
      <input
        type="text"
        className="w-128 pl-10 pr-3 py-2 border-2 border-solid border-gray-200 rounded-sm"
        placeholder="Cari apapun disini"
        value={keyword}
        onChange={(event) => keywordChange(event.target.value)}
      />
    </div>
  );
}

export default SearchBarTop;