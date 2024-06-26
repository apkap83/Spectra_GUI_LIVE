import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../config";
import auth from "../../services/authService";
import { getCurrentYear } from "./../../utils/myutils";
import { ReactComponent as NovaLogo } from "../../assets/novaLogo.svg";

export function LoginPage({ setIsAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userDetails = auth.getCurrentUser();
    if (userDetails) {
      navigate(config.homePage, { replace: true });
    }
  }, []);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const doSubmit = async (event) => {
    event.preventDefault();

    // Call the server
    try {
      await auth.login(username, password);

      // Retrieve the original URL
      let originalUrl =
        sessionStorage.getItem("preLoginURL") || config.homePage;

      // Check if the URL is absolute and convert it to relative if necessary
      if (
        originalUrl.startsWith("http://") ||
        originalUrl.startsWith("https://")
      ) {
        // Creating a URL object to extract pathname and search params
        const urlObj = new URL(originalUrl);
        originalUrl = urlObj.pathname + urlObj.search;
      }

      // window.location = originalUrl;

      // Remove preLoginURL from session storage
      sessionStorage.removeItem("preLoginURL");

      setIsAuthenticated(true);

      // Use navigate for redirection
      navigate(originalUrl, { replace: true });
    } catch (error) {
      setIsAuthenticated(false);
      localStorage.removeItem(config.jwtTokenKeyName);

      if (error.message === "Request failed with status code 403") {
        setError("Incorrect user name or password");
      } else {
        setError(error.message);
      }

      setUsername("");
      setPassword("");
    }
  };

  return (
    <div className="allscreen">
      <div className="myloginform">
        <form onSubmit={doSubmit}>
          <div className="form-inner">
            <h2 className="productName">
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
                  className="mt-3 alert alert-danger text-center"
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

            <div className="mybutton">
              <input type="submit" value="Login" />
            </div>
          </div>
        </form>
      </div>

      <div className="line">
        <div className="novaHomePageLogo">
          <NovaLogo className="novaLogo" />
        </div>
        <div className="nmsTeam font-face-chiller">
          NMS Team {getCurrentYear()}
        </div>
      </div>
    </div>
  );
}
