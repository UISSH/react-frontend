import request from "src/utils/request";

const api = {
  KVStorage: "/api/KVStorage/",
};

export function getKVList(params) {
  return request({
    url: `${api.KVStorage}${name}`, method: 'get', params: params
  })
}


export function getKV(name) {
  return request({
    url: `${api.KVStorage}${name}/`, method: 'get'
  })
}

export function createKV(name, val) {
  return request({
    url: `${api.KVStorage}`, method: 'post', data: {'key': name, 'value': val}
  })
}

export function updateKV(name, val) {
  return request({
    url: `${api.KVStorage}${name}/`, method: 'put', data: {'key': name, 'value': val}
  })
}

export function deleteKV(name) {
  return request({
    url: `${api.KVStorage}${name}/`, method: 'delete',

  })

}
