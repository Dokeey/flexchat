import React from "react";
import ReactDOM from "react-dom";
import { AppProvider } from "store";
import { BrowserRouter } from "react-router-dom";
import Root from "pages";
import "antd/dist/antd.css";
import "main.css";

ReactDOM.render(
  <BrowserRouter>
    <AppProvider>
      <Root />
    </AppProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
