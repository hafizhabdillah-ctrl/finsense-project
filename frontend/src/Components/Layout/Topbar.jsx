import React, { useContext, useState } from 'react';
import SearchBarTop from './SearchBarTop';
import SettingsModal from './SettingsModal';
import { useNavigate } from 'react-router-dom';
import { IoIosNotifications, IoIosSettings } from 'react-icons/io';
import { AuthContext } from '../../context/AuthContext';

function Topbar() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  return (
    <>
      <div className='sticky top-0 z-40 flex flex-row w-full py-4 border-b border-gray-200 bg-white'>
        {/* Search Bar */}
        <div className='mx-4 flex gap-2'>
          <span className='text-gray-500 text-3xl mr-2 px-2 border border-white hover:bg-gray-300 hover:border hover:rounded-lg transition-all'>
            <button onClick={() => navigate(-1)}>&larr;</button>
          </span>
          <span>
            <SearchBarTop />
          </span>
        </div>

        {/* Top Right */}
        <div className='ml-auto pr-6 flex flex-row items-center text-gray-500'>
          {/* Notification Bell */}
          <div className='flex items-center mx-4'>
            <button className='cursor-pointer hover:text-gray-700 transition-colors'>
              <IoIosNotifications size={30} />
            </button>
          </div>

          {/* Settings */}
          <div className='flex items-center'>
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className='cursor-pointer hover:text-gray-700 transition-colors'
            >
              <IoIosSettings size={30} />
            </button>
          </div>

          {/* Profile*/}
          <div className='ml-4 pl-4 flex items-center gap-3 border-l font-semibold text-sky-950 border-gray-300'>
            {user?.full_name || 'User'}
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </>
  );
}

export default Topbar;
