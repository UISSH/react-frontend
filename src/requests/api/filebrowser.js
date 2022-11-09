import request from "../utils/request";
//http://35.78.82.158:8000/api/FileBrowser/query/?directory=/var/db_backups/test1_ODmDSSx
const api = {
  fileBrowser: "/api/FileBrowser",
};

export function getFileText(absPath) {
  return request({
    url: `${api.fileBrowser}/file_text_operating/`,
    params: {
      abs_path: absPath,
    },
  });
}

export function updateFileText(absPath, text) {
  return request({
    url: `${api.fileBrowser}/file_text_operating/`,
    params: {
      abs_path: absPath,
    },
    method: "post",
    data: {
      path: absPath,
      text: text,
    },
  });
}

export function getUsers() {
  return request({
    url: `${api.fileBrowser}/get_users/`,
  });
}

export function listDirectory(directory) {
  return request({
    url: `${api.fileBrowser}/query/`,
    params: {
      directory: directory,
    },
  });
}

export function executeCMD(data) {
  /*
   * {current_directory:'',operation_command:''}
   * */
  return request({
    url: `${api.fileBrowser}/cmd/`,
    method: "post",
    data: data,
  });
}

export async function requestDownloadFileToken(absPath) {
  return await request({
    url: `${api.fileBrowser}/request_download_file/`,
    params: {
      path: absPath,
    },
  });
}

export function downloadFile(absPath) {
  requestDownloadFileToken(absPath).then((data) => {
    let _api = request.defaults.baseURL + `/api/FileBrowser/download_file/`;
    if (request.defaults.baseURL.endsWith("/")) {
      _api = request.defaults.baseURL + `api/FileBrowser/download_file/`;
    }
    let url = request.getUri({
      url: _api,
      params: {
        path: absPath,
        token: data.msg,
      },
    });
    console.log(url);

    window.location.href = url;
  });
}

export function uploadFile(directory, file) {
  let formData = new FormData();
  formData.append("file", file);
  return request({
    url: `${api.fileBrowser}/upload_file/`,
    params: {
      directory: directory,
    },
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
