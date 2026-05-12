import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';

const RegisterInput = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validasi password match
    if (password !== confirmPassword) {
      setError('Password dan Konfirmasi Password tidak cocok');
      return;
    }

    // Validasi panjang password minimal 6 karakter
    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    // Validasi nama lengkap tidak boleh kosong
    if (!fullName.trim()) {
      setError('Nama lengkap harus diisi');
      return;
    }

    // Validasi email tidak boleh kosong
    if (!email.trim()) {
      setError('Email harus diisi');
      return;
    }

    setLoading(true);

    try {
      await register(email, password, fullName);

      // Setelah registrasi berhasil, redirect ke halaman login
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      // Menangani error dari server
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError(
          'Registrasi gagal. Email mungkin sudah terdaftar atau server error.',
        );
      }
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='w-full'>
      {/* Full Name Input */}
      <div className='mb-2'>
        <label className='block text-gray-700 font-semibold mb-2 text-left'>
          Nama Lengkap
        </label>
        <input
          type='text'
          placeholder='Masukkan nama lengkap Anda'
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className='w-full p-3 text-base border-2 border-gray-300 rounded-lg 
                     focus:border-sky-950 focus:outline-none transition-colors
                     text-gray-800 placeholder-gray-400'
          required
        />
      </div>

      {/* Email Input */}
      <div className='mb-2'>
        <label className='block text-gray-700 font-semibold mb-2 text-left'>
          Email
        </label>
        <input
          type='email'
          placeholder='Masukkan email Anda'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full p-3 text-base border-2 border-gray-300 rounded-lg 
                     focus:border-sky-950 focus:outline-none transition-colors
                     text-gray-800 placeholder-gray-400'
          required
        />
      </div>

      {/* Password Input with Eye Icon */}
      <div className='mb-2'>
        <label className='block text-gray-700 font-semibold mb-2 text-left'>
          Password
        </label>
        <div className='relative'>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Masukkan password Anda'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full p-3 text-base border-2 border-gray-300 rounded-lg 
                       focus:border-sky-950 focus:outline-none transition-colors
                       text-gray-800 placeholder-gray-400'
            required
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer
                       p-1 hover:bg-gray-100 rounded-full transition-colors'
            aria-label={
              showPassword ? 'Sembunyikan password' : 'Tampilkan password'
            }
          >
            {showPassword ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-5 h-5 text-gray-500'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
                />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-5 h-5 text-gray-500'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88'
                />
              </svg>
            )}
          </button>
        </div>
        <p className='text-xs text-gray-500 mt-1 text-left'>
          Password minimal 6 karakter
        </p>
      </div>

      {/* Confirm Password Input with Eye Icon */}
      <div className='mb-4'>
        <label className='block text-gray-700 font-semibold mb-2 text-left'>
          Konfirmasi Password
        </label>
        <div className='relative'>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder='Konfirmasi password Anda'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className='w-full p-3 text-base border-2 border-gray-300 rounded-lg 
                       focus:border-sky-950 focus:outline-none transition-colors
                       text-gray-800 placeholder-gray-400'
            required
          />
          <button
            type='button'
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer
                       p-1 hover:bg-gray-100 rounded-full transition-colors'
            aria-label={
              showConfirmPassword
                ? 'Sembunyikan password'
                : 'Tampilkan password'
            }
          >
            {showConfirmPassword ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-5 h-5 text-gray-500'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
                />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-5 h-5 text-gray-500'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88'
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className='mb-4 p-2 bg-red-50 border border-red-200 rounded-lg'>
          <p className='text-red-600 text-sm text-center'>{error}</p>
        </div>
      )}

      {/* Register Button */}
      <button
        type='submit'
        disabled={loading}
        className='w-full bg-sky-950 text-white font-bold rounded-lg py-3
                   cursor-pointer transition-all duration-200
                   hover:bg-sky-900 active:scale-98
                   disabled:bg-gray-400 disabled:cursor-not-allowed'
      >
        {loading ? (
          <span className='flex items-center justify-center gap-2'>
            <svg
              className='animate-spin h-5 w-5 text-white'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              ></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              ></path>
            </svg>
            Memproses...
          </span>
        ) : (
          'Register akun'
        )}
      </button>

      {/* Linebreak */}
      <div className='relative my-6'>
        <div className='absolute inset-0 flex items-center'>
          <div className='w-full border-t border-gray-300'></div>
        </div>
        <div className='relative flex justify-center text-sm'>
          <span className='px-2 bg-white text-gray-500'>atau</span>
        </div>
      </div>

      {/* Footer Card - Login */}
      <p className='text-gray-500 text-center'>
        Sudah punya akun?{' '}
        <Link
          to='/login'
          className='text-orange-500 font-bold cursor-pointer hover:text-orange-600 
                     transition-colors'
        >
          Login disini
        </Link>
      </p>
    </form>
  );
};

export default RegisterInput;
