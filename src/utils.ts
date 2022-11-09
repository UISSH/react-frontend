
export function formatBytes(bytes:number, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
export class LocalStorageJson {
    static getItem(key: string): any {
        let data = window.localStorage.getItem(key)
        return JSON.parse(data ? data : "null")
    }


    static removeItem(key: string): void {
        window.localStorage.removeItem(key)
    }

    static setItem(key: string, value: object): void {
        window.localStorage.setItem(key, JSON.stringify(value))
    }

}

