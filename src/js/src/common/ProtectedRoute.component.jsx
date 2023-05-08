import React from "react";
import { Route, Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, element, ...rest }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Route {...rest} element={element} />;
};

export default ProtectedRoute;
