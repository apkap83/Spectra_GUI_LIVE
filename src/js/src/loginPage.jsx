import { useState } from "react";
import axios from "axios";
import config from "./config.json";
import auth from "./services/authService";

export function LoginPage() {
  const [username, setUsername] = useState("akapetan");
  const [password, setPassword] = useState("sXlZ5vlmUA98yXo7qERr");
  const [error, setError] = useState(null);

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
      console.log("Login successful");
      window.location = "/allspectraincidents";
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <div className="loginPage">
      <form onSubmit={doSubmit}>
        <h1>Login</h1>
        {error && <div>{error}</div>}
        <div>
          <label>Username</label>
          <input type="text" value={username} onChange={handleUsernameChange} />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
