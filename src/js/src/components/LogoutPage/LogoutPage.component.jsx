import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { logout } from "../../services/authService";

export const LogoutPage = ({ setIsAuthenticated }) => {
  useEffect(() => {
    setIsAuthenticated(false);
    // Remove token from local storage
    logout();
  }, []);

  return <Navigate to="/login" />;
};
