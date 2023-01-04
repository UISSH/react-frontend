import Cookies from "js-cookie";

import { ACCESS_TOKEN } from "../constant";
import { getApiGateway } from "./utils";

export let api = {
  version: "/api/version/",
  auth: "/api/User/login/",
  // Website
  website: "/api/Website/",
  websiteItem: "/api/Website/{id}/",
  enableWebsiteSSL: "/api/Website/{id}/enable_ssl/",
  disableWebsiteSSL: "/api/Website/{id}/disable_ssl/",
  verifyDomainRecords: "/api/Website/verify_dns_records/",
  // Application
  listApplication: "/api/Application/list_application/",
  createApplication: "/api/Application/{id}/app_create/",
  // Database
  database: "/api/DataBase/",
  databaseItem: "/api/DataBase/{id}/",
  createDatabaseInstance: "/api/DataBase/{id}/create_instance/",

  //FileBrowser
  fileBrowser: "/api/FileBrowser/",
  FileBrowserCmd: "/api/FileBrowser/cmd/",
};

export type ApiType = keyof typeof api;

export function hasAuthToken() {
  let token = Cookies.get(ACCESS_TOKEN);

  return Boolean(token);
}

function addHeader(ApiType: ApiType | string, init?: RequestInit) {
  let token = Cookies.get(ACCESS_TOKEN);
  let authorization = { Authorization: "token " + token };

  if (init?.body instanceof FormData) {
  } else {
    if (init?.headers && !init.headers.hasOwnProperty("Content-Type")) {
      init.headers = { "Content-Type": "application/json" };
    } else {
      init = { ...init, headers: { "Content-Type": "application/json" } };
    }
  }

  if (ApiType !== "auth") {
    init.headers = { ...init.headers, ...authorization };
  }
  return init;
}

interface Params {
  pathParam?: {
    id?: string;
    action?: string;
  };
  searchParam?: Record<string, string>;
}

export interface fetchDataProps {
  apiType: ApiType | string;
  init?: RequestInit;
  params?: Params;
}

export interface RequestDataProps {
  url: ApiType | string;
  headers?: Record<string, string>;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  data?: any;
  params?: Record<string, string>;
  paths?: {
    id?: string;
    action?: string;
  };
}

export function requestData(props: RequestDataProps): Promise<Response> {
  let data: any = {
    method: props.method ? props.method : "GET",
    headers: props.headers ? props.headers : {},
    body: {},
  };

  if (props.data instanceof FormData) {
    data.body = props.data;
  } else {
    data.body = JSON.stringify(props.data);
  }

  return fetchData({
    apiType: props.url,
    init: data,
    params: {
      pathParam: props.paths,
      searchParam: props.params,
    },
  });
}

// deprecated
export function fetchData(props: fetchDataProps): Promise<Response> {
  let init = addHeader(props.apiType, props.init);
  let { pathParam, searchParam } = props.params
    ? props.params
    : { pathParam: null, searchParam: null };
  let url: string | URL;

  if (api.hasOwnProperty(props.apiType)) {
    let index = props.apiType as ApiType;
    url = getApiGateway() + api[index];
  } else {
    url = getApiGateway() + props.apiType;
  }
  if (url.includes("{id}") && pathParam?.id) {
    if (!pathParam) {
      throw `${url} required 'id' PathParams`;
    } else {
      url = url.replace("{id}", pathParam.id);
    }
  }

  if (pathParam?.action) {
    url = `${url}${pathParam.action}/`;
  }

  if (url.includes("//localhost") || url.includes("//127.0.0")) {
    // return new Response("", { status: 403 });
    return new Promise((resolve, reject) => {
      resolve(new Response("", { status: 403 }));
    });
  } else {
    url = new URL(url);

    if (searchParam) {
      url.search = new URLSearchParams(searchParam).toString();
    }
    return fetch(url, init);
  }
}
