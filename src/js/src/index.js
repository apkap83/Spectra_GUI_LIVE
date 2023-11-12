import React from "react";
import AppWrapper from "./App";

import config from "./config.json";
import { createRoot } from "react-dom/client";

// import "./fonts/Chiller/chiller.ttf";
import "./index.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.css";

// import "@fontsource/roboto/300.css";
// import "@fontsource/roboto/400.css";
// import "@fontsource/roboto/500.css";
// import "@fontsource/roboto/700.css";

import "./scss/styles.scss";

// Set Time Zone
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

// Set the default timezone
dayjs.tz.setDefault("Europe/Athens");

document.title = config.appTitle;

window.onunhandledrejection = (event) => {
  //   console.error("Unhandled Promise Rejection:", event.reason);
  // Custom error handling logic goes here
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<AppWrapper style={{ position: "relative" }} />);
