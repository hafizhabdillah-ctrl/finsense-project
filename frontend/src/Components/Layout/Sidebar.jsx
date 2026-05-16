import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FiPlusCircle, FiLogOut } from 'react-icons/fi';
import { MdDashboard, MdInventory } from 'react-icons/md';
import { FaCashRegister, FaMoneyBill } from 'react-icons/fa';
import { FaUserGroup } from 'react-icons/fa6';
import { LuLogs } from 'react-icons/lu';
import logo from '../../../images/logo.png';

function Sidebar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout gagal:', error);
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: <MdDashboard size={22} />, path: '/dashboard' },
    {
      name: 'Catatan Keuangan',
      icon: <FaMoneyBill size={22} />,
      path: '/transactions',
    },
    {
      name: 'Manajemen Stok',
      icon: <MdInventory size={22} />,
      path: '/stocks',
    },
    { name: 'POS Terminal', icon: <FaCashRegister size={22} />, path: '/pos' },
    {
      name: 'Hutang & Pelanggan',
      icon: <FaUserGroup size={22} />,
      path: '/debts',
    },
    { name: 'Log Inventori', icon: <LuLogs size={22} />, path: '/logs' },
  ];

  return (
    <div className='sticky top-0 w-64 h-screen border-r border-gray-200 flex flex-col overflow-y-auto'>
      {/* Logo */}
      <div className='flex items-center px-4 py-4'>
        <img src={logo} alt='logo' className='h-14 w-14' />
        <h1 className='font-bold py-1 px-2 text-3xl'>
          Fin<span className='text-orange-300'>Sense</span>
        </h1>
      </div>

      {/* New Item */}
      <div className='mx-4 mt-2'>
        <NavLink
          to='/new'
          className='w-full bg-sky-950 text-white font-bold rounded-lg py-3 flex items-center justify-center gap-3'
        >
          <FiPlusCircle size={20} />
          <span>New Item</span>
        </NavLink>
      </div>

      {/* Menu Items */}
      <div className='mx-4 mt-8 text-sm'>
        {menuItems.map((item) => (
          <div key={item.name} className='mb-2'>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `w-full py-3 flex items-center justify-start rounded-lg transition ${
                  isActive
                    ? 'bg-sky-100 text-sky-900 font-bold border-l-4 border-sky-800'
                    : 'text-gray-500 font-medium border-l-4 border-transparent hover:bg-gray-50'
                }`
              }
            >
              <div className='mx-4'>{item.icon}</div>
              <span>{item.name}</span>
            </NavLink>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className='flex flex-col mt-auto py-4 text-gray-600'>
        <hr className='border-t border-gray-300 mx-4 mb-4' />

        <button
          onClick={handleLogout}
          className='flex mx-4 py-2 px-2 gap-2 items-center cursor-pointer hover:bg-gray-300 rounded-lg hover:text-gray-900 transition-colors transition-all'
        >
          <span>
            <FiLogOut size={18} />
          </span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
