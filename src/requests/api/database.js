import request from "../utils/request";

const api = {
  database: "/api/DataBase",
};

export function exportBackup(pk) {
  return request({
    url: `${api.database}/${pk}/export_backup/`,
    method: "post",
  });
}

export function importBackup(pk, path) {
  return request({
    url: `${api.database}/${pk}/import_backup/`,
    method: "post",
    params: {
      path: path,
    },
  });
}

export function listDatabase() {
  return request({
    url: `${api.database}/`,
  });
}

export function createNewDatabase(data) {
  return request({
    url: `${api.database}/`,
    method: "post",
    data: data,
  });
}

export function createDataBaseInstance(pk) {
  /*
   * 创建数据库实体
   * */
  return request({
    url: `${api.database}/${pk}/create_instance/`,
    method: "post",
  });
}

export function updateDatabase(pk, data) {
  return request({
    url: `${api.database}/${pk}/`,
    data: data,
    method: "patch",
  });
}

export function deleteDatabase(pk) {
  return request({
    url: `${api.database}/${pk}/`,
    method: "delete",
  });
}

export function getDatabase(pk) {
  return request({
    url: `${api.database}/${pk}/`,
    method: "get",
  });
}
