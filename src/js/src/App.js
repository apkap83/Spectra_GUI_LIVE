import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Navigate, useRoutes } from "react-router-dom";

import UserContext from "./contexts/UserContext";

import NotFound from "./components/Errors/NotFound.component";

import { LoginPage } from "./components/LoginPage/LoginPage.component";
import { LogoutPage } from "./components/LogoutPage/LogoutPage.component";

import ProtectedRoute from "./components/common/ProtectedRoute.component";

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

import { TripleAOutagesPlusRemedy } from "./components/Graphs/AAAOutages/TripleAOutagesPlusRemedy.component";
import { AAAOutagesRawData } from "./components/AAAOutagesRawData/aaaOutagesRawData";

import auth from "./services/authService";
import { ErrorBoundary } from "./components/Errors/ErrorBoundary.component";

const routes = [
  { path: "login", element: <LoginPage />, exact: true },
  { path: "mylogout", element: <LogoutPage />, exact: true },
  {
    path: "wind/allspectraincidents",
    element: <AllWindSpectraIncidents />,
    exact: true,
  },
  {
    path: "wind/openspectraincidents",
    element: <WindOpenSpectraIncidents />,
    exact: true,
  },
  {
    path: "nova/openspectraincidents",
    element: <NovaOpenSpectraIncidents />,
    exact: true,
  },
  {
    path: "nova/allspectraincidents",
    element: <AllNovaSpectraIncidents />,
    exact: true,
  },
  { path: "cdr-db/openincidents", element: <CdrDBOpenOutages />, exact: true },
  {
    path: "cdr-db/closedincidents",
    element: <CdrDBClosedOutages />,
    exact: true,
  },
  { path: "wind/stats", element: <WindStats />, exact: true },
  { path: "nova/stats", element: <NovaStats />, exact: true },
  { path: "wind/adhocoutages", element: <AdHocOutages />, exact: true },
  { path: "nova/adhocoutages", element: <NovaAdHocOutages />, exact: true },
  { path: "user_management", element: <Users />, exact: true },
  {
    path: "graphs/aaa-outagesplus-remedy",
    element: <TripleAOutagesPlusRemedy />,
    exact: true,
  },
  {
    path: "/graphs/aaa-outages-rawdata",
    element: <AAAOutagesRawData />,
    exact: true,
  },
  // { path: "/user_management_2", element: <Users_2 />, exact: true },
  {
    path: "/",
    element: <Navigate to={"nova/allspectraincidents"} />,
    exact: true,
  },
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
    <ErrorBoundary>
      <UserContext.Provider value={userDetails}>
        {/* <ScopedCssBaseline> */}
        <Router>
          <MyHeader />
          <div
            style={{
              marginBottom: "15rem", // Distance from Fixed Footer
              // height: "calc(100vh - 150px)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <App />
          </div>
          <MyFooter />
        </Router>
        {/* </ScopedCssBaseline> */}
      </UserContext.Provider>
    </ErrorBoundary>
  );
};

export default AppWrapper;
