import { useMediaQuery } from "@mui/material";
import { atom } from "recoil";

export const GlobalProgressAtom = atom({
  key: "globalProgress", // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});

export const GlobalLoadingAtom = atom({
  key: "globalLoading", // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});

export const AppBarOpenAtom = atom({
  key: "appBarOpen", // unique ID (with respect to other atoms/selectors)
  default: window.matchMedia("(min-width:900px)").matches, // default value (aka initial value)
});
