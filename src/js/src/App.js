import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Navigate, useRoutes } from "react-router-dom";

import UserContext from "./contexts/UserContext";

import NotFound from "./components/Errors/NotFound.component";

import { LoginPage } from "./components/LoginPage/LoginPage.component";
import { LogoutPage } from "./components/LogoutPage/LogoutPage.component";

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
import { AAAOutagesRawData } from "./components/Graphs/AAAOutagesRawData/aaaOutagesRawData";
import { OpenAIFunctions } from "./components/Graphs/OpenAIFunctions/openAIFunctions";

import auth from "./services/authService";
import { ErrorBoundary } from "./components/Errors/ErrorBoundary.component";
import { set } from "lodash";

const AppWrapper = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(auth.getCurrentUser());

  useEffect(() => {
    const userDetails = auth.getCurrentUser();
    setUserDetails(userDetails);
  }, [isAuthenticated]);

  const App = () => {
    // Create a Higher-Order Component for protected routes
    const ProtectedRoute = ({ component: Component }) => {
      // There is active JWT Token in Local Storage
      if (auth.getCurrentUser()) {
        return <Component />;
      }

      setIsAuthenticated(false);
      setUserDetails(null);

      // Write in your session the window location
      // It will be used from login component to redirect to the correct page
      sessionStorage.setItem("preLoginURL", window.location.href);

      // Redirect to login page if there is no valid JWT Token in Local Storage
      return <Navigate to="/login" />;
    };

    const routes = [
      {
        path: "login",
        element: <LoginPage setIsAuthenticated={setIsAuthenticated} />,
        exact: true,
      },
      {
        path: "logout",
        element: <LogoutPage setIsAuthenticated={setIsAuthenticated} />,
        exact: true,
      },
      {
        path: "wind/allspectraincidents",
        element: <ProtectedRoute component={AllWindSpectraIncidents} />,
        exact: true,
      },
      {
        path: "wind/openspectraincidents",
        element: <ProtectedRoute component={WindOpenSpectraIncidents} />,
        exact: true,
      },
      {
        path: "nova/openspectraincidents",
        element: <ProtectedRoute component={NovaOpenSpectraIncidents} />,
        exact: true,
      },
      {
        path: "nova/allspectraincidents",
        element: <ProtectedRoute component={AllNovaSpectraIncidents} />,
        exact: true,
      },
      {
        path: "cdr-db/openincidents",
        element: <ProtectedRoute component={CdrDBOpenOutages} />,
        exact: true,
      },
      {
        path: "cdr-db/closedincidents",
        element: <ProtectedRoute component={CdrDBClosedOutages} />,
        exact: true,
      },
      {
        path: "wind/stats",
        element: <ProtectedRoute component={WindStats} />,
        exact: true,
      },
      {
        path: "nova/stats",
        element: <ProtectedRoute component={NovaStats} />,
        exact: true,
      },
      {
        path: "wind/adhocoutages",
        element: <ProtectedRoute component={AdHocOutages} />,
        exact: true,
      },
      {
        path: "nova/adhocoutages",
        element: <ProtectedRoute component={NovaAdHocOutages} />,
        exact: true,
      },
      {
        path: "user_management",
        element: <ProtectedRoute component={Users} />,
        exact: true,
      },
      {
        path: "graphs/aaa-outagesplus-remedy",
        element: <ProtectedRoute component={TripleAOutagesPlusRemedy} />,
        exact: true,
      },
      {
        path: "/graphs/aaa-outages-rawdata",
        element: <ProtectedRoute component={AAAOutagesRawData} />,
        exact: true,
      },
      {
        path: "/graphs/openai_functions",
        element: <ProtectedRoute component={OpenAIFunctions} />,
        exact: true,
      },
      {
        path: "/",
        element: <Navigate to={"nova/allspectraincidents"} />,
        exact: true,
      },
      { path: "*", element: <NotFound /> },
    ];
    return useRoutes(routes);
  };

  return (
    <ErrorBoundary>
      <UserContext.Provider value={userDetails}>
        {/* <ScopedCssBaseline> */}
        <Router>
          {isAuthenticated && <MyHeader />}
          <App />
          <div style={{ marginBottom: "9rem" }}></div>
          {isAuthenticated && <MyFooter />}
        </Router>
        {/* </ScopedCssBaseline> */}
      </UserContext.Provider>
    </ErrorBoundary>
  );
};

export default AppWrapper;
