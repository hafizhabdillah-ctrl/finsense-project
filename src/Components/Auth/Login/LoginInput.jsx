import React from 'react';
import { Link } from 'react-router-dom';

class LoginInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      showPassword: false,
    };

    this.onEmailChangeHandler = this.onEmailChangeHandler.bind(this);
    this.onPasswordChangeHandler = this.onPasswordChangeHandler.bind(this);
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
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

  onSubmitHandler(event) {
    event.preventDefault();

    this.props.login({
      email: this.state.email,
      password: this.state.password
    });
  }

  render() {
    return (
      <form onSubmit={this.onSubmitHandler} className="flex flex-col">

        {/* Login Email */}
        <input
          className="px-4 py-2 mb-2 border-2 border-solid border-gray-300 rounded-lg"
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
      </form>
    );
  }
}

export default LoginInput;