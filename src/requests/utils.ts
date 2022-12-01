import Cookies from "js-cookie";
import { ACCESS_TOKEN, CURRENT_GATEWAY_API } from "../constant";
import { requestData } from "./http";

export function setApiGateway(domain: string) {
  window.localStorage.setItem(CURRENT_GATEWAY_API, domain);
}

export function getApiGateway() {
  let item = window.localStorage.getItem(CURRENT_GATEWAY_API);
  let domain;
  if (item == null || item == "/") {
    domain = window.location.protocol + "//" + window.location.host;
  } else {
    domain = item.trim();
    if (domain.endsWith("/")) {
      domain = domain.substring(0, domain.length - 1);
    }
  }
  return domain;
}

export function getWSGateway(path: string) {
  let token = Cookies.get(ACCESS_TOKEN);
  let url = `${getApiGateway().replace(
    "http",
    "ws"
  )}/ws/${path}/?token=${token}`;
  return url;
}

function updateKV(name: string, value: string) {
  return requestData({
    url: `/api/KVStorage/${name}/`,
    method: "PUT",
    data: { key: name, value: value },
  });
}

export class KVStorage {
  name: string;
  data: string | null;
  cloudData: string | null;
  constructor(name: string) {
    this.name = name;
    this.data = null;
    this.cloudData = null;
  }

  async init() {
    let res = await requestData({
      url: `/api/KVStorage/${this.name}/`,
    });
    if (res.ok) {
      this.cloudData = (await res.json()).value;
    } else {
      this.cloudData = null;
    }

    // if cloud data exist, sync it to local
    if (this.cloudData != null && this.cloudData !== "{}") {
      window.localStorage.setItem(this.name, this.cloudData);
      this.data = this.cloudData;
    } else {
      this.data = window.localStorage.getItem(this.name);
    }

    if (this.data && this.cloudData == null) {
      this.requestUpdateKV(this.data);
    }
    return new Promise<string | null>((resolve) => {
      resolve(this.data);
    });
  }

  getItem() {
    return this.data;
  }

  requestUpdateKV(val: string) {
    updateKV(this.name, val).then((res) => {
      if (res.ok) {
        console.info(`sync ${this.name} data successful!`);
      } else {
        console.error(`sync ${this.name} data failed!`);
      }
    });
  }

  setItem(val: string) {
    window.localStorage.setItem(this.name, val);
    this.data = val;
    if (this.cloudData == null) {
      this.requestUpdateKV(val);
    } else {
      updateKV(this.name, val).then((res) => {
        if (res.ok) {
          console.info(`sync ${this.name} data successful!`);
        } else {
          console.error(`sync ${this.name} data failed!`);
        }
      });
    }
  }

  removeItem(val: string) {
    window.localStorage.removeItem(this.name);
    if (this.data == null) {
      requestData({
        url: `/api/KVStorage/${this.name}/`,
        method: "DELETE",
      }).then((res) => {
        if (res.ok) {
          console.info(`delete ${this.name} data successful!`);
        } else {
          console.error(`delete ${this.name} data failed!`);
        }
      });
    }
  }
}
