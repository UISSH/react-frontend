import type { Location } from "@remix-run/router";
import { NavigateFunction } from "react-router-dom";
import { SHORTCUT_UNIQUE } from "../constant";
import { requestData } from "../requests/http";

/* 

cate = {
    name:string,
    description:
}

*/

export type ShortCutCategoryIF =
  | "terminal"
  | "database"
  | "terminal"
  | "website"
  | "folder"
  | "text";

interface CateIF {
  name: ShortCutCategoryIF;
  description: string;
}

export interface ShortcutIF {
  [key: string]: ShortcutItemIF[];
}

export interface ShortcutItemIF {
  name: string;
  unique: string; // uuid4 without -
  cate: CateIF["name"];
  router: Location;
}

/* 
  cloud 
    | - get dat
    v
  localstorage
    | - curd localstorage
    v
  cloud
    | - update cloud

*/

export const getShortcut = async (): Promise<ShortcutIF> => {
  let res = await requestData({
    url: "/api/KVStorage/SHORTCUT_DATA_V2/",
  });
  if (res.ok) {
    let data = await res.json();
    if (data.value === null) {
      data.value = "{}";
    }
    localStorage.setItem(SHORTCUT_UNIQUE, data.value);
    return JSON.parse(data.value);
  } else {
    localStorage.setItem(SHORTCUT_UNIQUE, "{}");
    return {};
  }
};

export const shortcutExist = (data: ShortcutItemIF) => {
  let shortcut = localStorage.getItem(SHORTCUT_UNIQUE);
  if (shortcut) {
    let shortcutObj = JSON.parse(shortcut);
    if (shortcutObj[data.cate]) {
      return shortcutObj[data.cate].some(
        (item: ShortcutItemIF) => item.unique === data.unique
      );
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export const addShortcut = (data: ShortcutItemIF) => {
  let shortcut = localStorage.getItem(SHORTCUT_UNIQUE);
  if (shortcut) {
    let shortcutObj = JSON.parse(shortcut);
    if (shortcutObj[data.cate]) {
      if (shortcutExist(data)) {
        return false;
      } else {
        shortcutObj[data.cate].push(data);
      }
    } else {
      shortcutObj[data.cate] = [data];
    }
    localStorage.setItem(SHORTCUT_UNIQUE, JSON.stringify(shortcutObj));
    return true;
  } else {
    return false;
  }
};

export const removeShortcut = (unique: string) => {
  let shortcut = localStorage.getItem(SHORTCUT_UNIQUE);
  if (shortcut) {
    let shortcutObj = JSON.parse(shortcut);
    for (let key in shortcutObj) {
      shortcutObj[key] = shortcutObj[key].filter(
        (item: ShortcutItemIF) => item.unique !== unique
      );
    }
    localStorage.setItem(SHORTCUT_UNIQUE, JSON.stringify(shortcutObj));
    return true;
  }
};

export const updateShortcut = (data: ShortcutItemIF) => {
  let shortcut = localStorage.getItem(SHORTCUT_UNIQUE);
  if (shortcut) {
    let shortcutObj = JSON.parse(shortcut);
    for (let key in shortcutObj) {
      shortcutObj[key] = shortcutObj[key].map((item: ShortcutItemIF) => {
        if (item.unique === data.unique) {
          return data;
        } else {
          return item;
        }
      });
    }
    localStorage.setItem(SHORTCUT_UNIQUE, JSON.stringify(shortcutObj));
    return true;
  }
};

// 根据 location 导航
export const navigateByLocation = (
  navigate: NavigateFunction,
  location: Location
) => {
  navigate(location.pathname, {
    state: location.state,
  });
};

export const syncShortcut = async (): Promise<Boolean> => {
  let shortcut = localStorage.getItem(SHORTCUT_UNIQUE);
  if (shortcut) {
    let res = await requestData({
      url: "/api/KVStorage/SHORTCUT_DATA_V2/",
      method: "PUT",
      data: {
        key: "SHORTCUT_DATA_V2",
        value: shortcut,
      },
    });
    if (res.ok) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};
