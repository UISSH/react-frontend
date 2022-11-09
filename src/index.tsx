import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { CssBaseline, StyledEngineProvider, ThemeProvider } from "@mui/material";
import getTheme from "./themes";
import './index.css'
import './i18n';
import { RecoilRoot } from 'recoil';
import { SnackbarProvider } from 'notistack';
const rootElement = document.getElementById('root');



ReactDOM.createRoot(rootElement as HTMLElement).render(<React.StrictMode>
  <RecoilRoot>
    <StyledEngineProvider injectFirst>
      <SnackbarProvider maxSnack={3} >
        <ThemeProvider theme={getTheme(rootElement)}>
          <CssBaseline />
          <RouterProvider router={router} />
        </ThemeProvider>
      </SnackbarProvider>
    </StyledEngineProvider>
  </RecoilRoot>

</React.StrictMode>)
