import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import { SnackbarProvider } from "notistack";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";
import "./i18n";
import "./index.css";
import { router } from "./router";
import getTheme from "./themes";
const rootElement = document.getElementById("root");
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

ReactDOM.createRoot(rootElement as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <StyledEngineProvider injectFirst>
        <SnackbarProvider maxSnack={3}>
          <ThemeProvider theme={getTheme(rootElement)}>
            <CssBaseline />
            <RouterProvider router={router} />
          </ThemeProvider>
        </SnackbarProvider>
      </StyledEngineProvider>
    </RecoilRoot>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();
