import {joinQuery, parseUrl, deepClone, getMegaloRoutePath, getCurrentRoute} from './utils'
declare let wx: any
declare let my: any
declare let swan: any

interface Route {
    query: object
    path: string
    fullPath: string
}
interface toRoute {
    query?: object
    path?: string
    fullPath?: string
    [key: string]: any
}
interface Platform {
    switchTab: Function
    navigateTo: Function
    redirectTo: Function
    navigateBack: Function
    reLaunch: Function
    [key: string]: any
}

class MegaloRouter {
    currentRoute: Route
    protected _platform: Platform
    get platform () {
        const that = this
        return {
            ready (callback) {
                that.getPlatform()
                    .then(callback)
            }
        }
    }
    tabBars: string[]
    constructor () {}
    push (to: string | toRoute = {}) {
        to = typeof to === 'string' ? {path: to} : to
        const { path } = parseUrl(to.path || '') as Route
        let action = this.tabBars.includes(path) ?  'switchTab' : 'navigateTo'
        this.navigate(action, to)
    }
    replace (to: string | toRoute = {}) {
        to = typeof to === "string" ? {path: to} : to
        const { path } = parseUrl(to.path || '') as Route
        let action = this.tabBars.includes(path) ?  'switchTab' : 'redirectTo'
        this.navigate(action, to)
    }
    async go (delta: number) {
        if (!delta) {
            this.reLaunch(this.currentRoute)
        }
        delta = -delta
        const platform: Platform = await this.getPlatform()
        platform.navigateBack({delta})
    }
    reLaunch (to: string | toRoute = {}) {
        to = typeof to === "string" ? {path: to} : to
        this.navigate('reLaunch', to)
    }
    async navigate (action:string = 'navigateTo', to: toRoute = {}) {
        try {
            if (!to.path) throw new Error('path 不能为空')
            const {
                path,
                query = {},
                success = () => {},
                fail = (err) => {
                    err.to = to
                    throw new Error(err)
                },
                complete = () => {}
            } = to
            // 如果有参数，拼接参数
            let url:string = Object.keys(query).length ? joinQuery(path, query) : path
            // 转换为符合megalo要求的相对路径
            url = getMegaloRoutePath(url)
            const platform: Platform = await this.getPlatform()
            platform[action]({
                url,
                success,
                fail,
                complete
            })
        } catch (e) {
            throw new Error(e)
        }
    }
    getPlatform (): Promise<Platform> {
        return new Promise<Platform>(resolve => {
            if (this._platform) {
                resolve(this._platform)
            } else {
                const timer = setInterval(() => {
                    if (this._platform) {
                        resolve(this._platform)
                        clearInterval(timer)
                    }
                }, 10)
            }
        })
    }
    install (Vue, options) {
        const router = this
        router.tabBars = options.tabBars || []
        Object.defineProperty(Vue.prototype, '$router', {
            get () {
                return router
            },
            set () {
                throw new Error('不能修改$router的值')
            }
        })
        Object.defineProperty(Vue.prototype, '$route', {
            get () {
                return router.currentRoute
            },
            set () {
                throw new Error('不能修改$route的值')
            }
        })
        Vue.mixin({
            beforeCreate () {
                if (this.$mp.page && this.$mp.page.route) {
                    const path = '/' + this.$mp.page.route
                    router.currentRoute = {
                        query: this.$mp.options,
                        path,
                        fullPath: joinQuery(path, this.$mp.options)
                    }
                }
                if(router._platform) return
                let platformType  = this.$mp.platform || undefined
                switch(platformType) {
                    case 'wechat':
                        router._platform = wx as Platform
                        break;
                    case 'alipay':
                        router._platform = my as Platform
                        break;
                    case 'swan':
                        router._platform = swan as Platform
                        break;
                    default:
                        router._platform = wx as Platform
                        throw new Error('vue-router无法识别小程序平台, 默认为wx')
                }
            },
            // onShow 里面还需要重新赋值一次，用于页面回退的时候纠正
            onShow () {
                if (this.$mp.page) {
                    const path = '/' + this.$mp.page.route
                    router.currentRoute = {
                        query: this.$mp.options,
                        path,
                        fullPath: joinQuery(path, this.$mp.options)
                    }
                }
            }
        })
    }
}

export default new MegaloRouter()
