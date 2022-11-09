import request from "../utils/request";

const api = {
  application: "/api/Application",
  website: "/api/Website",
};

export function updateWebDomainConfig(pk, data) {
  return request({
    url: `${api.website}/${pk}/update_domain/`,
    method: "post",
    data: data,
  });
}

export function updateWebConfig(pk, web_server_config) {
  return request({
    url: `${api.website}/${pk}/update_web_config/`,
    method: "post",
    data: {
      web_server_config: web_server_config,
    },
  });
}

export function disableWebsiteSSL(pk) {
  return request({
    url: `${api.website}/${pk}/disable_ssl/`,
    method: "post",
  });
}

export function enableWebsiteSSL(pk) {
  return request({
    url: `${api.website}/${pk}/enable_ssl/`,
    method: "post",
  });
}

export function verifyDomainRecords(domain) {
  return request({
    url: `${api.website}/verify_dns_records/`,
    params: {
      domain: domain,
    },
  });
}

export function listApplication() {
  return request({
    url: `${api.application}/list_application/`,
  });
}

export function listWebsite(params) {
  return request({
    url: api.website,
    params: params,
  });
}

export function getWebsite(pk) {
  return request({
    url: `${api.website}/${pk}/`,
  });
}

export function deleteWebsite(pk) {
  return request({
    url: `${api.website}/${pk}/`,
    method: "delete",
  });
}

export function getWebsiteCertificate(pk) {
  return request({
    url: `${api.website}/${pk}/get_ssl_info/`,
  });
}

export function putWebsite(instance, data) {
  return request({
    url: `${api.website}/${instance}/`,
    method: "put",
    data: data,
  });
}

export function patchWebsite(instance, data) {
  return request({
    url: `${api.website}/${instance}/`,
    method: "patch",
    data: data,
  });
}

export function createWebsite(data) {
  return request({
    url: `${api.website}/`,
    method: "post",
    data: data,
  });
}

export function attachDatabase(dbPk) {
  return request({
    url: `${api.website}/`,
    method: "patch",
    data: {},
  });
}
