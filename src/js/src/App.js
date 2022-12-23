import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import NotFound from "./components/Errors/NotFound.component";

import { AllSpectraIncidents } from "./components/Routes/AllSpectraIncidents";
import { OpenSpectraIncidents } from "./components/Routes/OpenSpectraIncidents";

import { CdrDBOpenOutagesTable } from "./components/Routes/CdrDBOpenInc";
import { CdrDBClosedOutagesTable } from "./components/Routes/CdrDBClosedInc";

import { AdHocOutages } from "./components/AdHocOutages.component";

import { DataTable } from "./components/DataTable/SpectraIncidentsDataTable.component";

import Stats from "./components/stats/stats.component";
import ScopedCssBaseline from "@mui/material/ScopedCssBaseline";

import MyHeader from "./components/Header/MyHeader.component";
import { getCurrentYear } from "./utils/myutils";
import { Layout } from "antd";
const { Footer } = Layout;

// import Test from "./components/Test";

const footerClass =
  "p-2 bg-dark border-top border-2 border-secondary text-white d-flex justify-content-center fixed-bottom";

class App extends Component {
  state = {};

  render() {
    return (
      <ScopedCssBaseline>
        <Router>
          <MyHeader />
          <Routes>
            {/* <Route exact path="/test" element={<Test />} /> */}
            <Route
              path="/"
              element={<Navigate replace to="/allspectraincidents" />}
            />
            <Route
              exact
              path="/allspectraincidents"
              element={<AllSpectraIncidents />}
            />
            <Route
              exact
              path="/openspectraincidents"
              element={<OpenSpectraIncidents />}
            />
            <Route
              exact
              path="/opencdrdbincidents"
              element={<CdrDBOpenOutagesTable />}
            />
            <Route
              exact
              path="/closedcdrdbincidents"
              element={<CdrDBClosedOutagesTable />}
            />
            <Route path="/stats" element={<Stats />} />

            <Route path="/adhocoutages" element={<AdHocOutages />} />
            {/* Not Found Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer className={footerClass}>
            WIND - NMS Team {getCurrentYear()}
          </Footer>
        </Router>
      </ScopedCssBaseline>
    );
  }
}
export default App;
