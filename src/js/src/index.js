import React from "react";
import App from "./App";
import { LoginPage } from "./loginPage";

import config from "./config.json";
import { createRoot } from "react-dom/client";

import "./styles.scss";

import "bootstrap/dist/css/bootstrap.min.css";
// import "antd/dist/antd.css";
// import "antd/dist/antd.min.css";
import "./myStyles.css";
import "bootstrap/dist/css/bootstrap.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

// Inject AllContext
// import { AllProvider } from "./contexts/All.context";

document.title = config.appTitle;

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App style={{ position: "relative" }} />);
// root.render(<LoginPage />);
