import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import NotFound from "./components/NotFound";
import AllSpectraIncidents from "./components/AllSpectraIncidents";
import { OpenSpectraIncidents } from "./components/OpenSpectraIncidents";
import { OpenCdrDBIncidents } from "./components/OpenCdrDBIncidents";
import { ClosedCdrDBIncidents } from "./components/ClosedCdrDBIncidents";
import { AdHocOutages } from "./components/AdHocOutages";
import Stats from "./components/stats/stats.component";

import MyHeader from "./components/MyHeader";
import { getCurrentYear } from "./utills/myutils";
import { Layout } from "antd";
const { Footer } = Layout;

const footerClass =
  "p-2 bg-dark border-top border-2 border-secondary text-white d-flex justify-content-center fixed-bottom";

class App extends Component {
  state = {};

  render() {
    return (
      <React.Fragment>
        <Router>
          <MyHeader />
          <Routes>
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
              element={<OpenCdrDBIncidents />}
            />
            <Route
              exact
              path="/closedcdrdbincidents"
              element={<ClosedCdrDBIncidents />}
            />
            <Route path="/stats" element={<Stats />} />
            <Route
              path="/"
              element={<Navigate replace to="/allspectraincidents" />}
            />

            <Route path="/adhocoutages" element={<AdHocOutages />} />
            {/* Not Found Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer className={footerClass}>
            WIND - NMS Team {getCurrentYear()}
          </Footer>
        </Router>
      </React.Fragment>
    );
  }
}
export default App;
