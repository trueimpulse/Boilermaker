import React from "react";
import { connect } from "react-redux";
import Login from "./Login";
import { me } from "../store/user";

class UserHome extends React.Component {
  componentDidMount() {
    this.props.me();
  }

  render() {
    const user = this.props.user;
    return (
      <div>
        <Login />
        <p>Hello {user.name}!</p>
      </div>
    );
  }
}

const mapState = (state) => ({
  user: state.user,
});

const mapDispatch = (dispatch) => ({
  me: () => dispatch(me()),
});

export default connect(mapState, mapDispatch)(UserHome);
