import React from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';

function SearchBarTop({ keyword, keywordChange }) {
  return (
    <div className='relative w-full'>
      <FaMagnifyingGlass
        className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'
        size={18}
      />
      <input
        type='text'
        className='w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-md focus:outline-none focus:border-sky-950 transition-colors'
        placeholder='Cari apapun disini...'
        value={keyword}
        onChange={(event) => keywordChange(event.target.value)}
      />
    </div>
  );
}

export default SearchBarTop;
