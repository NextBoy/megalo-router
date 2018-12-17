/**
 * @description url拼接参数
 * @param url {string}
 * @param query {object}
 */
export function joinQuery (url: string, query: object): string {
    const keys = Object.keys(query)
    if (!keys.length) {
        return url
    } else {
        const pairs: string[] = keys.map(key => `${key}=${query[key]}`)
        url = /\?/g.test(url) ? `${url}&` : `${url}?`
        url += pairs.join('&')
        return url
    }
}

/**
 * @description 解析url
 * @param fullPath {string}
 * @return {path, query, fullPath} {Object}
 */
export function parseUrl (fullPath: string): object {
    let path: string = fullPath
    let query: object = {}
    if (/\?/g.test(fullPath)) {
        path = fullPath.split('?')[0]
        let queryString: string = fullPath.split('?')[1]
        let pairs: string[] = queryString.split('&')
        pairs.forEach(pair => {
            let pairArr = pair.split('=')
            query[pairArr[0]] = pairArr[1] || ''
        })
    }
    return {
        path,
        query,
        fullPath
    }
}

/**
 * @description 深拷贝
 * @param obj {object}
 * @return obj {object}
 */
export function deepClone (obj: object) {
    let objClone: any[] | object = Array.isArray(obj) ? [] : {}
    if (obj && typeof obj === 'object') {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                // 判断ojb子元素是否为对象，如果是，递归复制
                if (obj[key] && typeof obj[key] === 'object') {
                    objClone[key] = deepClone(obj[key])
                } else {
                    // 如果不是，简单复制
                    objClone[key] = obj[key]
                }
            }
        }
    }
    return objClone
}

declare const getCurrentPages: Function
/**
 * @description 获取当前路由
 */
export const getCurrentRoute = (): string => {
    const pages = getCurrentPages()
    return pages[pages.length - 1].route
}
/**
 * @description 转换路由路径为符合megalo的路径
 * @param pathB {string}
 * @return url {string}
 */
export const getMegaloRoutePath = (pathB: string): string => {
    const pathA: string = getCurrentRoute()
    const toTop: string = pathA.split('/').reduce((res, val, index, arr) => {
        if (index === arr.length - 1 || !val) return res
        return '../' + res
    }, '')
    return (toTop + pathB).replace(/\/\//g, '/')
}
