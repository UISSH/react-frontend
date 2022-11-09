import request from "../utils/request";

const api = {
  ftpServer: "/api/FtpServer/",

};

export function installFtpServer() {
  return request({
    url: api.ftpServer + 'install/',
    method: 'post'
  })
}

export function pingFtpServer() {
  return request({
    url: api.ftpServer + 'ping/'
  })
}

export function listFtpServer(params) {
  return request({
    url: api.ftpServer,
    params: params
  })
}

export function patchAccount(pk, data) {
  return request({
    url: api.ftpServer + `${pk}/`,
    method: 'patch',
    data: data
  })
}

export function postAccount(data) {
  return request({
    url: api.ftpServer,
    method: 'post',
    data: data
  })
}

export function deleteAccount(pk) {
  return request({
    url: api.ftpServer + `${pk}/`,
    method: 'delete'
  })
}

export function syncFtpServerAccount() {
  return request({
    url: api.ftpServer + 'sync_account/',
    method: 'post'
  })
}


export function reloadFtpServer() {
  return request({
    url: api.ftpServer + 'sync_account/',
    method: 'post'
  })
}

export function startFtpServer() {
  return request({
    url: api.ftpServer + 'start_service/',
    method: 'post'
  })
}

export function stopFtpServer() {
  return request({
    url: api.ftpServer + 'stop_service/',
    method: 'post'
  })
}
