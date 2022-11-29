//https://m3.material.io/theme-builder#/custom

import { createTheme } from "@mui/material";

function getTheme(rootElement?: HTMLElement | null) {
  return createTheme({
    palette: {
      common: {
        black: "#EADDFF",
      },
      primary: {
        light: "#381E72",
        main: "#7F67BE",
        dark: "#9A82DB",
        900: "#21005D",
        800: "#381E72",
        700: "#4F378B",
        600: "#6750A4",
        500: "#7F67BE",
        400: "#9A82DB",
        300: "#B69DF8",
        200: "#D0BCFF",
        100: "#EADDFF",
        50: "#F6EDFF",
      },
      secondary: {
        light: "#332D41",
        main: "#7A7289",
        dark: "#958DA5",
        900: "#1D192B",
        800: "#332D41",
        700: "#4A4458",
        600: "#625B71",
        500: "#7A7289",
        400: "#958DA5",
        300: "#B0A7C0",
        200: "#CCC2DC",
        100: "#E8DEF8",
        50: "#F6EDFF",
      },
      error: {
        light: "#601410",
        main: "#DC362E",
        dark: "#E46962",
        900: "#410E0B",
        800: "#601410",
        700: "#8C1D18",
        600: "#B3261E",
        500: "#DC362E",
        400: "#E46962",
        300: "#EC928E",
        200: "#F2B8B5",
        100: "#F9DEDC",
        50: "#FCEEEE",
      },

      warning: {
        light: "#7D5260",
        main: "#986977",
        dark: "#D29DAC",
        900: "#31111D",
        800: "#492532",
        700: "#633B48",
        600: "#7D5260",
        500: "#986977",
        400: "#B58392",
        300: "#D29DAC",
        200: "#EFB8C8",
        100: "#FFD8E4",
        50: "#FFECF1",
      },
      success: {
        light: "#FFFFFF",
        main: "#7D5260",
        dark: "#31111D",
      },
      grey: {
        900: "#1C1B1F",
        800: "#313033",
        700: "#484649",
        600: "#605D62",
        500: "#787579",
        400: "#939094",
        300: "#AEAAAE",
        200: "#C9C5CA",
        100: "#E6E1E5",
        50: "#F4EFF4",
      },

      text: {
        primary: "#1C1B1F",
        secondary: "#625B71",
        disabled: "#E7E0EC",
      },
      background: {
        paper: "#FFFBFE",
        default: "#FFFBFE",
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
