import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
const queryClient = new QueryClient();

ReactDOM.createRoot(rootElement as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <StyledEngineProvider injectFirst>
        <QueryClientProvider client={queryClient}>
          <SnackbarProvider maxSnack={3}>
            <ThemeProvider theme={getTheme(rootElement)}>
              <CssBaseline />
              <RouterProvider router={router} />
            </ThemeProvider>
          </SnackbarProvider>
        </QueryClientProvider>
      </StyledEngineProvider>
    </RecoilRoot>
  </React.StrictMode>
);
