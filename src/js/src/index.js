import React from "react";
import App from "./App";
import config from "./config.json";
import { createRoot } from "react-dom/client";

import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.css";
import "./myStyles.css";
import "bootstrap/dist/css/bootstrap.css";

document.title = config.appTitle;

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <>
    <App style={{ position: "relative" }} />
  </>
);
