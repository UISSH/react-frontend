import { atom } from "recoil";

export const GlobalProgressAtom = atom({
  key: "globalProgress",
  default: false,
});

export const GlobalLoadingAtom = atom({
  key: "globalLoading",
  default: false,
});

export const AppBarOpenAtom = atom({
  key: "appBarOpen",
  default: window.matchMedia("(min-width:900px)").matches,
});

export interface TerminalGlobalCommand {
  uuid: string;
  command: string;
  uniques: string[];
}
export const TerminalGlobalCommandDispatchAtom = atom({
  key: "terminalGlobalCommandAtom",
  default: {
    uuid: "",
    command: "",
    uniques: [],
  } as TerminalGlobalCommand,
});

export interface ShortCut {}
// todo get from backend, and save to backend
export const ShortCutAtom = atom({
  key: "shortCutAtom",
  default: {} as ShortCut,
});
