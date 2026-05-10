import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './Topbar';
import Chat from '../Features/Chat/Chat';

function MainLayout() {
  return (
    <div className="flex w-screen h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar />

      {/* TopBar */}
      <div className="flex-1 flex flex-col">
        <TopBar />

        {/* Content */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>

      <Chat />
    </div>
  );
}

export default MainLayout;