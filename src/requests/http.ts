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

interface DjangoTableResponse {
  pagination: Pagination;
  results: any[];
}

interface Pagination {
  total_pages: number;
  current_page: number;
  total_record: number;
  next?: any;
  previous?: any;
}
export function hasAuthToken() {
  let token = window.sessionStorage.getItem(ACCESS_TOKEN);
  return Boolean(token);
}

function addHeader(ApiType: ApiType | string, init?: RequestInit) {
  let token = window.sessionStorage.getItem(ACCESS_TOKEN);
  let authorization = { Authorization: "token " + token };
  let csrftoken = Cookies.get("csrftoken");

  let csrf = {};
  if (csrftoken) {
    csrf = { "X-CSRFToken": csrftoken };
  }

  if (init?.body instanceof FormData) {
    // pass
  } else {
    if (init?.headers && !init.headers.hasOwnProperty("Content-Type")) {
      init.headers = { "Content-Type": "application/json" };
    } else {
      init = { ...init, headers: { "Content-Type": "application/json" } };
    }
  }

  if (ApiType !== "auth") {
    init.headers = { ...init.headers, ...authorization, ...csrf };
  } else {
    init.headers = { ...init.headers, ...csrf };
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
/**
 * execute osquery sql,
 *
 * shecma: https://www.osquery.io/schema/5.8.2/
 *
 * docs: https://osquery.readthedocs.io/en/stable/introduction/using-osqueryi/
 *
 * @param {string} sql e.g: select * from processes;
 * @returns
 */
export async function requestOsqueryData(sql: string) {
  // 兼容 Django 返回的数据格式
  let data = {
    url: "/api/Operating/excute_command_sync/",
    method: "POST" as const,
    data: {
      command: `osqueryi "${sql}" --json`,
      cwd: "/tmp/",
    },
  };

  let resPonse = new Promise<{
    ok: boolean;
    json: () => Promise<DjangoTableResponse>;
  }>(async (resolve) => {
    let res = await requestData(data);
    resolve({
      ok: res.ok,
      json: async () => {
        let json = await res.json();
        let data = JSON.parse(json.msg);
        return {
          pagination: {
            total_pages: 1,
            current_page: 1,
            total_record: json.length,
          },
          results: data,
        } as DjangoTableResponse;
      },
    });
  });

  return resPonse;
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
