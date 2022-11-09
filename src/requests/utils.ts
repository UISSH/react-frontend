import Cookies from "js-cookie";
import { ACCESS_TOKEN, CURRENT_GATEWAY_API } from "../constant";

export function setApiGateway(domain: string) {
    window.localStorage.setItem(CURRENT_GATEWAY_API, domain)
}

export function getApiGateway() {

    let item = window.localStorage.getItem(CURRENT_GATEWAY_API)
    let domain;
    if (item == null || item == '/') {
        domain = window.location.protocol + "//" + window.location.host
    } else {
        domain = item.trim()
        if (domain.endsWith("/")) {
            domain = domain.substring(0, domain.length - 1)
        }
    }
    return domain

}

export function getWSGateway(path: string) {
    let token = Cookies.get(ACCESS_TOKEN)
    let url = `${getApiGateway().replace("http", "ws")}/ws/${path}/?token=${token}`;
    return url
}

