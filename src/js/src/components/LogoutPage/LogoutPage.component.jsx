import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import auth from "../../services/authService";

export const LogoutPage = ({ setUserDetails }) => {
  useEffect(() => {
    setUserDetails(null);
    // Remove token from local storage
    auth.logout();
  }, []);

  return <Navigate to="/login" />;
};
