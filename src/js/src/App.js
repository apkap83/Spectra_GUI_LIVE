import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import NotFound from "./components/Errors/NotFound.component";

import { AllWindSpectraIncidents } from "./components/Routes/WindAllSpectraIncidents";
import { WindOpenSpectraIncidents } from "./components/Routes/WindOpenSpectraIncidents";

import { AllNovaSpectraIncidents } from "./components/Routes/NovaAllSpectraIncidents";
import { NovaOpenSpectraIncidents } from "./components/Routes/NovaOpenSpectraIncidents";

import { CdrDBOpenOutages } from "./components/Routes/CdrDBOpenInc";
import { CdrDBClosedOutages } from "./components/Routes/CdrDBClosedInc";

import { AdHocOutages } from "./components/AdHocOutages.component";
import { NovaAdHocOutages } from "./components/NovaAdHocOutages.component";

import { DataTable } from "./components/DataTable/SpectraIncidentsDataTable.component";

import WindStats from "./components/stats/WindStats.component";
import NovaStats from "./components/stats/NovaStats.component";

import ScopedCssBaseline from "@mui/material/ScopedCssBaseline";

import MyHeader from "./components/Header/MyHeader.component";
import { getCurrentYear } from "./utils/myutils";
import { Layout } from "antd";
const { Footer } = Layout;

import { ReactComponent as NovaLogo } from "./assets/novaLogo.svg";

// import Test from "./components/Test";

const footerClass =
  "p-1 bg-dark border-top border-2 border-secondary text-white d-flex flex-column justify-content-center align-items-center fixed-bottom";

class App extends Component {
  state = {};

  render() {
    return (
      // <ScopedCssBaseline>
      <Router>
        <MyHeader />
        <div
          style={{
            width: "98vw",
            margin: "auto",
          }}
        >
          <Routes>
            {/* <Route exact path="/test" element={<Test />} /> */}
            <Route
              path="/"
              element={<Navigate replace to="/allspectraincidents" />}
            />
            <Route
              exact
              path="/allspectraincidents"
              element={<AllWindSpectraIncidents />}
            />
            <Route
              exact
              path="/openspectraincidents"
              element={<WindOpenSpectraIncidents />}
            />

            <Route
              exact
              path="/nova_openspectraincidents"
              element={<NovaOpenSpectraIncidents />}
            />
            <Route
              exact
              path="/nova_allspectraincidents"
              element={<AllNovaSpectraIncidents />}
            />

            <Route
              exact
              path="/opencdrdbincidents"
              element={<CdrDBOpenOutages />}
            />
            <Route
              exact
              path="/closedcdrdbincidents"
              element={<CdrDBClosedOutages />}
            />
            <Route path="/stats" element={<WindStats />} />

            <Route path="/nova_stats" element={<NovaStats />} />

            <Route path="/adhocoutages" element={<AdHocOutages />} />

            <Route path="/nova_adhocoutages" element={<NovaAdHocOutages />} />

            {/* Not Found Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer className={footerClass}>
          <NovaLogo style={{ width: "110px" }} fill="white" stroke="black" />
          <span className="nmsteam">NMS Team {getCurrentYear()}</span>
        </Footer>
      </Router>
      // </ScopedCssBaseline>
    );
  }
}
export default App;
