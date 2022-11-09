import {USER_INFO} from "../constant";
import {LocalStorageJson} from "../utils";


interface UserInfo {
    username: string
    password: string
    remember_me: boolean
}

export function getUserInfo() {
    let userinfo: UserInfo;
    userinfo = {username: "", password: "", remember_me: false,}
    let item = LocalStorageJson.getItem(USER_INFO)
    if (item && item["remember_me"]) {
        userinfo = item
    }
    return userinfo
}

