import { Component } from "react";
import { Navigate } from "react-router-dom";
import { logout } from "../../services/authService";

export class LogoutPage extends Component {
  constructor(props) {
    super(props);

    // Remove token from local storage
    logout();
  }

  render() {
    return <Navigate to="/login" />;
  }
}
