import { useState } from "react";
import axios from "axios";
import config from "../../config.json";
import auth from "../../services/authService";
import "./login.scss";

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post(`${config.apiPrefix}/api/authenticate`, { username, password })
      .then((response) => {
        // Authentication succeeded, store the access token and redirect to the dashboard
        sessionStorage.setItem("JWT_Token", response.data.jwt);
        console.log("successful login");
        // window.location.href = "/dashboard";
      })
      .catch((error) => {
        sessionStorage.removeItem("JWT_Token");
        console.log("error", error);
        // Authentication failed, display an error message
        setError("Invalid username or password");
      });
  };

  const doSubmit = async (event) => {
    event.preventDefault();

    // Call the server
    try {
      await auth.login(username, password);
      window.location = "/nova_openspectraincidents";
    } catch (ex) {
      sessionStorage.removeItem("JWT_Token");
      setError("Invalid username or password");
    }
  };

  return (
    <div className="myloginform">
      <form onSubmit={doSubmit}>
        <div className="form-inner">
          <h2>
            Spectra Login
            <span
              className="ant-tag ant-tag-green"
              style={{ marginLeft: "15px", verticalAlign: "middle" }}
            >
              Live Environment
            </span>
          </h2>
          <div className="form-group">
            {error && (
              <div
                className="mt-3 alert alert-danger"
                style={{ width: "300px" }}
              >
                {error}
              </div>
            )}
            <label htmlFor="username">User Name</label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={handleUsernameChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>

          <input type="submit" value="LOGIN" />
        </div>
      </form>
    </div>
  );
}
