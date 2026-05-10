import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';

class LoginInput extends React.Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      showPassword: false,
      rememberMe: false,
      error: '',
      loading: false,
      redirect: false,
    };

    this.onEmailChangeHandler = this.onEmailChangeHandler.bind(this);
    this.onPasswordChangeHandler = this.onPasswordChangeHandler.bind(this);
    this.onRememberMeChange = this.onRememberMeChange.bind(this);
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
  }

  componentDidMount() {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      this.setState({ email: savedEmail, rememberMe: true });
    }
  }

  onEmailChangeHandler(event) {
    this.setState({ email: event.target.value });
  }

  onPasswordChangeHandler(event) {
    this.setState({ password: event.target.value });
  }

  onRememberMeChange(event) {
    this.setState({ rememberMe: event.target.checked });
  }

  async onSubmitHandler(event) {
    event.preventDefault();
    this.setState({ error: '', loading: true });

    const { email, password, rememberMe } = this.state;
    const { login } = this.context;

    // Proteksi jika context belum siap
    if (!login) {
      this.setState({ error: 'Authentication tidak tersedia', loading: false });
      return;
    }

    try {
      await login(email, password);

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      this.setState({ redirect: true });
    } catch (err) {
      this.setState({
        error: 'Login gagal. Periksa email dan password.',
        loading: false,
      });
    }
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to='/dashboard' replace />;
    }

    const { email, password, showPassword, rememberMe, error, loading } =
      this.state;

    return (
      <form onSubmit={this.onSubmitHandler} className='flex flex-col'>
        {/* Email */}
        <input
          className='px-4 py-2 mb-2 border-2 border-solid border-gray-300 rounded-lg'
          type='email'
          placeholder='Email'
          value={email}
          onChange={this.onEmailChangeHandler}
          required
        />

        {/* Password dengan toggle */}
        <div className='relative mb-2'>
          <input
            className='w-full px-4 py-2 border-2 border-solid border-gray-300 rounded-lg'
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            value={password}
            onChange={this.onPasswordChangeHandler}
            required
          />
          <button
            type='button'
            onClick={() => this.setState({ showPassword: !showPassword })}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500'
          >
            {showPassword ? 'Sembunyikan' : 'Tampilkan'}
          </button>
        </div>

        {/* Error */}
        {error && <p className='text-red-500 text-sm mb-2'>{error}</p>}

        {/* Baris Ingat Saya & Lupa Password */}
        <div className='flex justify-between items-center mb-4'>
          <label className='flex items-center gap-2 text-sm text-gray-700'>
            <input
              type='checkbox'
              checked={rememberMe}
              onChange={this.onRememberMeChange}
              className='w-4 h-4'
            />
            Ingat Saya
          </label>
          <Link
            to='/lupa-password'
            className='text-sm text-sky-950 hover:underline'
          >
            Lupa password?
          </Link>
        </div>

        {/* Tombol Login - HANYA SATU */}
        <button
          type='submit'
          disabled={loading}
          className='w-full bg-sky-950 text-white font-bold rounded-lg py-2 mt-2'
        >
          {loading ? 'Memproses...' : 'Log in'}
        </button>

        {/* Link Buat Akun Baru */}
        <div className='text-center mt-4 text-sm'>
          Belum punya akun?{' '}
          <Link
            to='/register'
            className='text-sky-950 font-semibold hover:underline'
          >
            Buat akun baru
          </Link>
        </div>
      </form>
    );
  }
}

export default LoginInput;
