import Cookies from 'js-cookie'

import { ACCESS_TOKEN } from "../constant";
import { getApiGateway } from "./utils";

export let api = {
    version: "/api/version/",
    accountLogin: "/api/User/login/",
    // Website
    website: '/api/Website/',
    enableWebsiteSSL: '/api/Website/{id}/enable_ssl/',
    disableWebsiteSSL: '/api/Website/{id}/disable_ssl/',
    verifyDomainRecords:'/api/Website/verify_dns_records/',
    // Application
    listApplication: '/api/Application/list_application/'
};




export type ApiType = keyof typeof api



export function hasAuthToken() {
    let token = Cookies.get(ACCESS_TOKEN)

    return Boolean(token)
}
function addHeader(ApiType: ApiType, init?: RequestInit) {
    let token = Cookies.get(ACCESS_TOKEN)
    let authorization = { "Authorization": "token " + token }

    if (init?.headers && !init.headers.hasOwnProperty("Content-Type")) {
        init.headers = { 'Content-Type': 'application/json' }
    } else {
        init = { ...init, headers: { 'Content-Type': 'application/json' } }
    }

    if (ApiType !== "accountLogin") {
        init.headers = { ...init.headers, ...authorization }
    }

    return init

}

interface Params {
    pathParam?: {
        id: string;
    }
    searchParam?: Record<string, string>
}

export function getfetch(ApiType: ApiType, init?: RequestInit, params?: Params): Promise<Response> {
    init = addHeader(ApiType, init)
    let { pathParam, searchParam } = params ? params : { pathParam: null, searchParam: null }


    let url: string | URL = getApiGateway() + api[ApiType]
    if (api[ApiType].includes("{id}")) {
        if (!pathParam) {
            throw `${api[ApiType]} required 'id' PathParams`
        } else {
            url = url.replace("{id}", pathParam.id)
        }

    }

    if (url.includes("//localhost") || url.includes("//127.0.0")) {
        // return new Response("", { status: 403 });
        return new Promise((resolve, reject) => {
            resolve(new Response("", { status: 403 }))
        })

    } else {
        url = new URL(url)

        if (searchParam) {
            console.log("==")
            url.search = new URLSearchParams(searchParam).toString();
        }
        return fetch(url, init)
    }
}



