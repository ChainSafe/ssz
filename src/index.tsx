import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import {transitions, Provider as AlertProvider} from "react-alert";
import AlertTemplate from "react-alert-template-basic";

import "./styles.scss";

const options = {
  timeout: 3000,
  offset: "30px",
  transition: transitions.SCALE
};

ReactDOM.render(
  <AlertProvider template={AlertTemplate} {...options}>
    <App />
  </AlertProvider>,
  document.getElementById("app"));
