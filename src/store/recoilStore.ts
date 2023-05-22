import { atom, selector } from "recoil";
import { requestData } from "../requests/http";

export const UpdateExplorerTableUISignalAtom = atom({
  key: "updateExplorerTableUISignal",
  default: 1,
});

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

export interface SHORTCUT_DATA_V1_Object {
  id: number;
  create_at: string;
  update_at: string;
  key: string;
  value: string;
}
const ShortCutListAtom = selector({
  key: "ShortCutListAtom111111",
  get: async ({ get }) => {
    // get from backend
    let res = await requestData({
      url: "/api/KVStorage/SHORTCUT_DATA_V1/",
    });
    if (res.ok) {
      let data: SHORTCUT_DATA_V1_Object = await res.json();
      return JSON.parse(data.value);
    } else {
      return {};
    }
  },
  set: async ({ set }, newValue) => {
    // sync to backend
    let res = await requestData({
      url: "/api/KVStorage/SHORTCUT_DATA_V1/",
      method: "PUT",
      data: {
        key: "SHORTCUT_DATA_V1",
        value: JSON.stringify(newValue),
      },
    });
  },
});

//export const selectorServerShortCutListAtom = selector({});

// export const ServerShortCutListAtom = selector({
//   key: "shortCutAtom",
//   get: ({ get }) => {},
// });
