import { CreateDatabase } from "./../components/website/interface";
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
};

export type ApiType = keyof typeof api;

export function hasAuthToken() {
  let token = Cookies.get(ACCESS_TOKEN);

  return Boolean(token);
}
function addHeader(ApiType: ApiType, init?: RequestInit) {
  let token = Cookies.get(ACCESS_TOKEN);
  let authorization = { Authorization: "token " + token };

  if (init?.headers && !init.headers.hasOwnProperty("Content-Type")) {
    init.headers = { "Content-Type": "application/json" };
  } else {
    init = { ...init, headers: { "Content-Type": "application/json" } };
  }

  if (ApiType !== "auth") {
    init.headers = { ...init.headers, ...authorization };
  }

  return init;
}

interface Params {
  pathParam?: {
    id: string;
  };
  searchParam?: Record<string, string>;
}

export interface GetFetchProps {
  apiType: ApiType;
  init?: RequestInit;
  params?: Params;
}

export function getfetch(props: GetFetchProps): Promise<Response> {
  let init = addHeader(props.apiType, props.init);
  let { pathParam, searchParam } = props.params
    ? props.params
    : { pathParam: null, searchParam: null };

  let url: string | URL = getApiGateway() + api[props.apiType];
  if (api[props.apiType].includes("{id}")) {
    if (!pathParam) {
      throw `${api[props.apiType]} required 'id' PathParams`;
    } else {
      url = url.replace("{id}", pathParam.id);
    }
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
