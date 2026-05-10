import React from 'react';
import { Link } from 'react-router-dom';

class LoginInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
    };

    this.onUsernameChangeHandler = this.onUsernameChangeHandler.bind(this);
    this.onEmailChangeHandler = this.onEmailChangeHandler.bind(this);
    this.onPasswordChangeHandler = this.onPasswordChangeHandler.bind(this);
    this.onConfirmPasswordChangeHandler = this.onConfirmPasswordChangeHandler.bind(this);
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
  }

  onUsernameChangeHandler(event) {
    this.setState(() => {
      return {
        username: event.target.value
      };
    });
  }

  onEmailChangeHandler(event) {
    this.setState(() => {
      return {
        email: event.target.value
      };
    });
  }

  onPasswordChangeHandler(event) {
    this.setState(() => {
      return {
        password: event.target.value
      };
    });
  }

  onConfirmPasswordChangeHandler(event) {
    this.setState(() => {
      return {
        confirmPassword: event.target.value
      };
    });
  }

  onSubmitHandler(event) {
    event.preventDefault();

    if (this.state.password !== this.state.confirmPassword) {
      alert('Password dan Konfirmasi Password tidak cocok');
      return;
    }

    this.props.register({
      username: this.state.username,
      email: this.state.email,
      password: this.state.password
    });
  }

  render() {
    return (
      <form onSubmit={this.onSubmitHandler} className="flex flex-col">

        {/* Login Username */}
        <input
          className="px-4 py-2 mb-4 border-2 border-solid border-gray-300 rounded-lg"
          type="text"
          placeholder='Username'
          value={this.state.username}
          onChange={this.onUsernameChangeHandler}
        />

        {/* Login Email */}
        <input
          className="px-4 py-2 mb-4 border-2 border-solid border-gray-300 rounded-lg"
          type="email"
          placeholder='Email'
          value={this.state.email}
          onChange={this.onEmailChangeHandler}
        />

        {/* Login Password */}
        <input
          className="px-4 py-2 mb-4 border-2 border-solid border-gray-300 rounded-lg"
          type="password"
          placeholder='Password'
          value={this.state.password}
          onChange={this.onPasswordChangeHandler}
        />

        {/* Login Confirm Password */}
        <input
          className="px-4 py-2 mb-4 border-2 border-solid border-gray-300 rounded-lg"
          type="password"
          placeholder='Confirm Password'
          value={this.state.confirmPassword}
          onChange={this.onConfirmPasswordChangeHandler}
        />

        {/* Register Button */}
        <button className="bg-sky-950 text-white font-bold rounded-lg py-2 cursor-pointer">Register akun</button>

        {/* Linebreak */}
        <div className="bg-gray-200 mt-4 mb-2">
          <hr className="border-t border-gray-300" />
        </div>

        {/* Footer Card */}
        <p className="text-gray-500">
          Sudah punya akun?{' '}
          <Link
            to="/login"
            className="text-orange-500 font-bold cursor-pointer"
          >
            login disini
          </Link>
        </p>
      </form>
    );
  }
}

export default LoginInput;