import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Navigate, useRoutes } from "react-router-dom";

import UserContext from "./contexts/UserContext";

import NotFound from "./components/Errors/NotFound.component";

import { LoginPage } from "./components/LoginPage/LoginPage.component";
import { LogoutPage } from "./components/LogoutPage/LogoutPage.component";

import ProtectedRoute from "./common/ProtectedRoute.component";

import { AllWindSpectraIncidents } from "./components/Routes/WindAllSpectraIncidents";
import { WindOpenSpectraIncidents } from "./components/Routes/WindOpenSpectraIncidents";

import { AllNovaSpectraIncidents } from "./components/Routes/NovaAllSpectraIncidents";
import { NovaOpenSpectraIncidents } from "./components/Routes/NovaOpenSpectraIncidents";

import { CdrDBOpenOutages } from "./components/Routes/CdrDBOpenInc";
import { CdrDBClosedOutages } from "./components/Routes/CdrDBClosedInc";

import { AdHocOutages } from "./components/AdHocOutages.component";
import { NovaAdHocOutages } from "./components/NovaAdHocOutages.component";

import WindStats from "./components/stats/WindStats.component";
import NovaStats from "./components/stats/NovaStats.component";

import ScopedCssBaseline from "@mui/material/ScopedCssBaseline";

import { MyHeader } from "./components/Header/MyHeader.component";
import { MyFooter } from "./components/Footer/MyFooter.component";

import { Users } from "./components/Users/Users.component";
// import { Users_2 } from "./components/Users/Users_2.component";

import auth from "./services/authService";

const routes = [
  { path: "/login", element: <LoginPage />, exact: true },
  { path: "/logout", element: <LogoutPage />, exact: true },
  {
    path: "/allspectraincidents",
    element: <AllWindSpectraIncidents />,
    exact: true,
  },
  {
    path: "/openspectraincidents",
    element: <WindOpenSpectraIncidents />,
    exact: true,
  },
  {
    path: "/nova_openspectraincidents",
    element: <NovaOpenSpectraIncidents />,
    exact: true,
  },
  {
    path: "/nova_allspectraincidents",
    element: <AllNovaSpectraIncidents />,
    exact: true,
  },
  { path: "/opencdrdbincidents", element: <CdrDBOpenOutages />, exact: true },
  {
    path: "/closedcdrdbincidents",
    element: <CdrDBClosedOutages />,
    exact: true,
  },
  { path: "/stats", element: <WindStats />, exact: true },
  { path: "/nova_stats", element: <NovaStats />, exact: true },
  { path: "/adhocoutages", element: <AdHocOutages />, exact: true },
  { path: "/nova_adhocoutages", element: <NovaAdHocOutages />, exact: true },
  { path: "/user_management", element: <Users />, exact: true },
  // { path: "/user_management_2", element: <Users_2 />, exact: true },
  { path: "/", element: <Navigate to={"/allspectraincidents"} />, exact: true },
  { path: "*", element: <NotFound /> },
];

const App = () => {
  const routing = useRoutes(routes);
  return routing;
};

const AppWrapper = () => {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const userDetails = auth.getCurrentUser();
    setUserDetails(userDetails);
  }, []);

  return (
    <UserContext.Provider value={userDetails}>
      <ScopedCssBaseline>
        <Router>
          <MyHeader />
          <App />
          <MyFooter />
        </Router>
      </ScopedCssBaseline>
    </UserContext.Provider>
  );
};

export default AppWrapper;
