import { useState } from "react";
import axios from "axios";

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
      .post("/api/login", { username, password })
      .then((response) => {
        // Authentication succeeded, store the access token and redirect to the dashboard
        localStorage.setItem("access_token", response.data.access_token);
        window.location.href = "/dashboard";
      })
      .catch((error) => {
        // Authentication failed, display an error message
        setError("Invalid username or password");
      });
  };

  return (
    <div className="loginPage">
      <form onSubmit={handleSubmit}>
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
