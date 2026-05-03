import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../utils/network-data.js';
import RegisterInput from '../../Components/Auth/Register/RegisterInput.jsx';
import logo from '../../../images/logo.png';

function LoginPage({ loginSuccess }) {
  const navigate = useNavigate();

  async function onLogin({ email, password }) {
    const { error, data } = await login({ email, password });

    if (!error) {
      loginSuccess({ accessToken: data.accessToken });
      navigate('/dashboard');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      {/* Login Card */}
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="flex flex-col items-center">
          {/* Logo and Name */}
          <div className="flex flex-row px-6">
            <img src={logo} alt="logo" className="h-12 w-12 mb-2 mx-2"/>
            <h1 className="text-3xl font-bold text-sky-950">Fin<span className="text-orange-400">Sense</span></h1>
          </div>

          <h2 className="text-2xl font-bold text-sky-950 mb-2">Selamat Datang</h2>
          <p className="text-gray-500 text-sm mb-4">Buat akun baru untuk manajemen bisnis Anda.</p>

          {/* Login Input */}
          <div className="w-full text-center py-2">
            <RegisterInput />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;