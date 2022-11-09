import request from "../utils/request";

const api = {
  terminal: "/api/Terminal/",
};

export function uploadFileToSFTP(auth, target_path, file) {
  let data = new FormData()
  data.append("auth", JSON.stringify(auth))
  data.append("target_path", target_path)
  data.append("file", file)
  return request({
    url: api.terminal + "upload_file/", method: 'post', data: data, headers: {"Content-Type": "multipart/form-data"},
  })

}
