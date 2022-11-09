import request from "../utils/request";

const api = {
  version: "/version/",
};

export function getVersion() {
  return request({
    url: api.version
  })
}


