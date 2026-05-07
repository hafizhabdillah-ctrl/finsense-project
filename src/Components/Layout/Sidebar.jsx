import React from 'react';
import { NavLink } from 'react-router-dom';

import { FiPlusCircle } from 'react-icons/fi';
import { MdDashboard, MdInventory, MdContactSupport } from 'react-icons/md';
import { FaCashRegister } from 'react-icons/fa';
import { FaUserGroup } from 'react-icons/fa6';
import { LuLogs } from 'react-icons/lu';
import { IoIosLogOut } from 'react-icons/io';

import logo from '../../../images/logo.png';

function Sidebar() {
  const menuItems = [
    { name: 'Dashboard', icon: <MdDashboard size={22}/>, path: '/dashboard' },
    { name: 'Manajemen Stok', icon: <MdInventory size={22}/>, path: '/stock' },
    { name: 'POS Terminal', icon: <FaCashRegister size={22}/>, path: '/pos' },
    { name: 'Hutang & Pelanggan', icon: <FaUserGroup size={22}/>, path: '/debt' },
    { name: 'Log Inventori', icon: <LuLogs size={22}/>, path: '/log' },
  ];

  return (
    <div className="w-64 h-screen border-r border-gray-200 flex flex-col">

      {/* Logo + FinSense*/}
      <div className="flex items-center px-4 py-4">
        <img src={logo} alt="logo" className="h-14 w-14"/>
        <h1 className="font-bold py-1 px-2 text-3xl">
          Fin<span className="text-orange-300">Sense</span>
        </h1>
      </div>

      {/* New Item btn ke /new */}
      <div className="mx-4 mt-2">
        <NavLink
          to="/new"
          className="w-full bg-sky-950 text-white font-bold rounded-lg py-3 flex items-center justify-center gap-3 cursor-pointer">
          <FiPlusCircle size={20}/>
          <span>New Item</span>
        </NavLink>
      </div>

      {/* Pages */}
      <div className="mx-4 mt-8 text-sm">
        {menuItems.map((item) => {
          return (
            <div key={item.name} className="mb-2">
              <NavLink
                to={item.path}
                className={({ isActive }) =>`w-full py-3 flex items-center justify-start transition-all cursor-pointer rounded-lg hover:text-gray-700 transition-colors
                  ${isActive
              ? 'bg-sky-100 text-sky-900 font-bold border-l-6'
              : 'bg-transparent text-gray-500 font-medium border-l-6 border-transparent hover:bg-gray-50'}`}>
                <div className="flex justify-center mx-4">
                  {item.icon}
                </div>
                <span>{item.name}</span>
              </NavLink>
            </div>
          );
        })}
      </div>

      {/* Bottom Sidebar */}
      <div className="flex flex-col mt-auto py-4 text-gray-600">

        {/* Linebreak */}
        <div className="bg-gray-200 mb-4">
          <hr className="border-t border-gray-300 mx-32" />
        </div>

        {/* Bantuan */}
        <button className="flex mx-4 py-2 px-2 items-center hover:bg-gray-300 rounded-lg hover:text-gray-900 transition-colors transition-all">
          <div className="flex mx-2">
            <MdContactSupport size={22}/>
          </div>
          <span>Bantuan</span>
        </button>

        {/* Keluar */}
        <button className="flex mx-4 py-2 px-2 items-center hover:bg-gray-300 rounded-lg hover:text-gray-900 transition-colors transition-all">
          <div className="flex mx-2">
            <IoIosLogOut size={22}/>
          </div>
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;