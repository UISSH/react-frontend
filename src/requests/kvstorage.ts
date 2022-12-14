import { requestData } from "./http";
const api = {
  KVStorage: "/api/KVStorage/",
};

export interface GetKVListParams {
  page: string;
  search: string;
  page_size: string;
}
export function getKVList(params: GetKVListParams) {
  return requestData({
    url: `${api.KVStorage}`,
    method: "GET",
    params: params as any,
  });
}

export function getKV(name: string) {
  return requestData({
    url: `${api.KVStorage}${name}/`,
    method: "GET",
  });
}

export function createKV(name: string, val: string) {
  return requestData({
    url: `${api.KVStorage}`,
    method: "POST",
    data: { key: name, value: val },
  });
}

export function updateKV(name: string, val: string) {
  return requestData({
    url: `${api.KVStorage}${name}/`,
    method: "PUT",
    data: { key: name, value: val },
  });
}

export function deleteKV(name: string) {
  return requestData({
    url: `${api.KVStorage}${name}/`,
    method: "DELETE",
  });
}
