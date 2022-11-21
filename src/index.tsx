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
