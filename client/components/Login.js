import React from "react";
import { connect } from "react-redux";
import { login } from "../store/user";

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  render() {
    return (
      <div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            this.props.login(this.state);
          }}
        >
          <input
            type="text"
            name="email"
            onChange={this.handleChange}
            value={this.state.email}
          />
          <input
            type="password"
            name="password"
            onChange={this.handleChange}
            value={this.state.password}
          />
          <button type="submit">Login</button>
        </form>
        <a href="/auth/google">Login with Google</a>
      </div>
    );
  }
}

const mapDispatch = (dispatch) => ({
  login: (body) => dispatch(login(body)),
});

export default connect(null, mapDispatch)(Login);
