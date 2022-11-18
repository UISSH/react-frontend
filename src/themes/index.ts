import { components } from "./../requests/schema";
import { createTheme } from "@mui/material";

function getTheme(rootElement?: HTMLElement | null) {
  return createTheme({
    palette: {
      common: {
        black: "#111936",
      },
      primary: {
        light: "#8eacbb",
        main: "#607d8b",
        dark: "#34515e",
      },
      secondary: {
        light: "#64d8cb",
        main: "#26a69a",
        dark: "#00766c",
        200: "#b39ddb",
        800: "#4527a0",
      },
      error: {
        light: "#ef9a9a",
        main: "#f44336",
        dark: "#c62828",
      },

      warning: {
        light: "#fff8e1",
        main: "#ffe57f",
        dark: "#ffc107",
      },
      success: {
        light: "#b9f6ca",
        200: "#69f0ae",
        main: "#00e676",
        dark: "#00c853",
      },
      grey: {
        50: "#fafafa",
        100: "#f5f5f5",
        200: "#eeeeee",
        300: "#e0e0e0",
        500: "#8492c4",
        600: "#212121",
        700: "#bdc8f0",
        900: "#212121",
      },

      text: {
        primary: "#111936",
        secondary: "#8492c4",
        disabled: "#f5f5f5",
      },
      background: {
        paper: "#ffffff",
        default: "#ffffff",
      },
    },
    components: {
      MuiPopover: {
        defaultProps: {
          container: rootElement,
        },
      },
      MuiPopper: {
        defaultProps: {
          container: rootElement,
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.text.disabled,
          }),
        },
      },
    },
  });
}
export default getTheme;
