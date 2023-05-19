import React from "react";
import AppWrapper from "./App";

import config from "./config.json";
import { createRoot } from "react-dom/client";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import "./scss/styles.scss";

document.title = config.appTitle;

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<AppWrapper style={{ position: "relative" }} />);
