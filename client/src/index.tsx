import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import { store } from "./redux/store";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { createTheme, ThemeProvider } from "@mui/material";

import "./index.css";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement!);

const theme = createTheme();

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
