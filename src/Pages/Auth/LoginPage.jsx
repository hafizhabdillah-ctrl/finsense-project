import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import LoginInput from '../../Components/Auth/Login/LoginInput.jsx';

import logo from '../../../images/logo.png';

function LoginPage({ loginSuccess }) {
  const navigate = useNavigate();

  return (min-h-screen flex items-center justify-center bg-gray-200
    <div className="">

      {/* Login Card */}
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="flex flex-col items-center">

          {/* Logo and Name */}
          <div className="flex flex-row">
            <img src={logo} alt="logo" className="h-12 w-12 mb-2 mx-2"/>
            <h1 className="text-3xl font-bold text-sky-950">Fin<span className="text-orange-400">Sense</span></h1>
          </div>

          <h2 className="text-2xl font-bold text-sky-950 mb-2">Selamat Datang</h2>
          <p className="text-gray-500 text-sm mb-4">Masuk ke dashboard manajemen bisnis Anda.</p>

          <div className="w-full text-center py-2">

            {/* Login Input */}
            <LoginInput />

            {/* Remember Me and Forgot Password */}
            <div className="flex flex-row items-center justify-between px-1 mb-4">
              <label className="flex items-center gap-2 cursor-pointer text-sky-950 font-bold">
                <input type="checkbox" className="w-4 h-4 border-gray-500 accent-sky-950" />
                Ingat Saya
              </label>
              <button className="text-orange-400 font-bold cursor-pointer">Lupa password?</button>
            </div>

            {/* Login Button */}
            <button className="w-full bg-sky-950 text-white font-bold rounded-lg py-2 cursor-pointer">Log in</button>

            {/* Linebreak */}
            <div className="bg-gray-200 mt-4 mb-2">
              <hr className="border-t border-gray-300" />
            </div>

            {/* Footer Card */}
            <p className="text-gray-500">
              Belum punya akun?{' '}
              <Link
                to="/register"
                className="text-orange-500 font-bold cursor-pointer">
                Buat akun baru
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;