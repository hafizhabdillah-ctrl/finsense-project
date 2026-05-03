import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './Topbar';

function MainLayout() {
  return (
    <div className="flex w-screen h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar />

      {/* TopBar + Content */}
      <div className="flex-1 flex flex-col">
        <TopBar />

        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;