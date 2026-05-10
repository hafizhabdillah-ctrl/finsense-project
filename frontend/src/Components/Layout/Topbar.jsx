import React from 'react';
import SearchBarTop from './SearchBarTop';
import { useNavigate } from 'react-router-dom';
import { IoIosNotifications, IoIosSettings } from 'react-icons/io';

{/* jangan lupa diganti aowkaowkoawk */}
import bahlil from '../../../images/bahlil.jpg';

function Topbar() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-row w-full py-4 border-b border-gray-200">

      {/* Search Bar */}
      <div className="mx-4 flex gap-2">
        <span className="text-gray-500 text-3xl mr-2 px-2 border border-white hover:bg-gray-300 hover:border hover:rounded-lg transition-all">
          <button
            onClick={() => navigate(-1)}
          >
            &larr;
          </button>
        </span>
        <span>
          <SearchBarTop />
        </span>
      </div>

      {/* Top Right */}
      <div className="ml-auto pr-6 flex flex-row items-center text-gray-500">

        {/* Notification Bell */}
        <div className="flex items-center mx-4">
          <button className="cursor-pointer hover:text-gray-700 transition-colors">
            <IoIosNotifications size={30}/>
          </button>
        </div>

        {/* Settings */}
        <div className="flex items-center">
          <button className="cursor-pointer hover:text-gray-700 transition-colors">
            <IoIosSettings size={30}/>
          </button>
        </div>

        {/* Profile*/}
        <div className="ml-4 pl-4 flex items-center gap-3 border-l border-gray-300 hover:opacity-80 transition-opacity">

          {/* Avatar */}
          <div className="flex flex items-center w-11 h-11 rounded-full border-2 border-sky-900 overflow-hidden bg-gray-100">
            <img
              src={bahlil}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topbar;