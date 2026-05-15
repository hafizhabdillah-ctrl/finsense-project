import { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './Topbar';
import Chat from '../Features/Chat/Chat';
import { AuthContext } from '../../context/AuthContext';
import Loading from '../../components/Loading';

function MainLayout() {
  const { user, loading } = useContext(AuthContext);

  // Loading dengan fullScreen
  if (loading) {
    return <Loading fullScreen text='Memuat dashboard...' />;
  }

  if (!user) {
    return <Navigate to='/login' replace />;
  }

  return (
    <div className='flex w-screen h-screen bg-gray-100'>
      <Sidebar />
      <div className='flex-1 flex flex-col overflow-hidden'>
        <TopBar />
        <div className='flex-1 overflow-y-auto'>
          <Outlet />
        </div>
      </div>
      <Chat />
    </div>
  );
}

export default MainLayout;
