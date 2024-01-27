import React, { useState, useEffect, lazy, Suspense, Fragment } from "react";
import { BrowserRouter as Router, Navigate, useRoutes } from "react-router-dom";

import UserContext from "./contexts/UserContext";

import NotFound from "./components/Errors/NotFound.component";

import { LoginPage } from "./components/LoginPage/LoginPage.component";
// const LoginPage = lazy(() =>
//   import("./components/LoginPage/LoginPage.component").then((module) => ({
//     default: module.LoginPage,
//   }))
// );

// import { LogoutPage } from "./components/LogoutPage/LogoutPage.component";
const LogoutPage = lazy(() =>
  import("./components/LogoutPage/LogoutPage.component").then((module) => ({
    default: module.LogoutPage,
  }))
);

import { AllWindSpectraIncidents } from "./components/Routes/WindAllSpectraIncidents";
// const AllWindSpectraIncidents = lazy(() =>
//   import("./components/Routes/WindAllSpectraIncidents").then((module) => ({
//     default: module.AllWindSpectraIncidents,
//   }))
// );

import { WindOpenSpectraIncidents } from "./components/Routes/WindOpenSpectraIncidents";
// const WindOpenSpectraIncidents = lazy(() =>
//   import("./components/Routes/WindOpenSpectraIncidents").then((module) => ({
//     default: module.WindOpenSpectraIncidents,
//   }))
// );

import { AllNovaSpectraIncidents } from "./components/Routes/NovaAllSpectraIncidents";
// const AllNovaSpectraIncidents = lazy(() =>
//   import("./components/Routes/NovaAllSpectraIncidents").then((module) => ({
//     default: module.AllNovaSpectraIncidents,
//   }))
// );

import { NovaOpenSpectraIncidents } from "./components/Routes/NovaOpenSpectraIncidents";
// const NovaOpenSpectraIncidents = lazy(() =>
//   import("./components/Routes/NovaOpenSpectraIncidents").then((module) => ({
//     default: module.NovaOpenSpectraIncidents,
//   }))
// );

import { CdrDBOpenOutages } from "./components/Routes/CdrDBOpenInc";
// const CdrDBOpenOutages = lazy(() =>
//   import("./components/Routes/CdrDBOpenInc").then((module) => ({
//     default: module.CdrDBOpenOutages,
//   }))
// );

// import { CdrDBClosedOutages } from "./components/Routes/CdrDBClosedInc";
const CdrDBClosedOutages = lazy(() =>
  import("./components/Routes/CdrDBClosedInc").then((module) => ({
    default: module.CdrDBClosedOutages,
  }))
);

// import { AdHocOutages } from "./components/AdHocOutages.component";
const AdHocOutages = lazy(() =>
  import("./components/AdHocOutages.component").then((module) => ({
    default: module.AdHocOutages,
  }))
);

// import { NovaAdHocOutages } from "./components/NovaAdHocOutages.component";
const NovaAdHocOutages = lazy(() =>
  import("./components/NovaAdHocOutages.component").then((module) => ({
    default: module.NovaAdHocOutages,
  }))
);

import WindStats from "./components/stats/WindStats.component";
// const WindStats = lazy(() => import("./components/stats/WindStats.component"));

import NovaStats from "./components/stats/NovaStats.component";
// const NovaStats = lazy(() => import("./components/stats/NovaStats.component"));

import ScopedCssBaseline from "@mui/material/ScopedCssBaseline";

import { MyHeader } from "./components/Header/MyHeader.component";
// const MyHeader = lazy(() =>
//   import("./components/Header/MyHeader.component").then((module) => ({
//     default: module.MyHeader,
//   }))
// );

import { MyFooter } from "./components/Footer/MyFooter.component";
// const MyFooter = lazy(() =>
//   import("./components/Footer/MyFooter.component").then((module) => ({
//     default: module.MyFooter,
//   }))
// );

// import { Users } from "./components/Users/Users.component";
const Users = lazy(() =>
  import("./components/Users/Users.component").then((module) => ({
    default: module.Users,
  }))
);

// import { Users_2 } from "./components/Users/Users_2.component";

import { TripleAOutagesPlusRemedy } from "./components/Graphs/AAAOutages/TripleAOutagesPlusRemedy.component";
// const TripleAOutagesPlusRemedy = lazy(() =>
//   import(
//     "./components/Graphs/AAAOutages/TripleAOutagesPlusRemedy.component"
//   ).then((module) => ({ default: module.TripleAOutagesPlusRemedy }))
// );

import { AAAOutagesRawData } from "./components/Graphs/AAAOutagesRawData/aaaOutagesRawData";
// const AAAOutagesRawData = lazy(() =>
//   import("./components/Graphs/AAAOutagesRawData/aaaOutagesRawData").then(
//     (module) => ({ default: module.AAAOutagesRawData })
//   )
// );

// import { OpenAIFunctions } from "./components/Graphs/OpenAIFunctions/openAIFunctions";

import auth from "./services/authService";
import { ErrorBoundary } from "./components/Errors/ErrorBoundary.component";
import { set } from "lodash";
import { Spin } from "antd";

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
        path: "/",
        element: <Navigate to={"nova/allspectraincidents"} />,
        exact: true,
      },
      { path: "*", element: <NotFound /> },
    ];
    return useRoutes(routes);
  };

  const HeaderAndFooter = () => {
    return (
      <Fragment>
        {<MyHeader />}
        <div style={{ marginBottom: "9rem" }}></div>
        {<MyFooter />}
      </Fragment>
    );
  };

  return (
    <Suspense fallback={<Spin />}>
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
    </Suspense>
  );
};

export default AppWrapper;
