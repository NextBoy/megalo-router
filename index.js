var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "./utils"], function (require, exports, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MegaloRouter = (function () {
        function MegaloRouter() {
        }
        Object.defineProperty(MegaloRouter.prototype, "platform", {
            get: function () {
                var that = this;
                return {
                    ready: function (callback) {
                        that.getPlatform()
                            .then(callback);
                    }
                };
            },
            enumerable: true,
            configurable: true
        });
        MegaloRouter.prototype.push = function (to) {
            if (to === void 0) { to = {}; }
            to = typeof to === 'string' ? { path: to } : to;
            var path = utils_1.parseUrl(to.path || '').path;
            var action = this.tabBars.includes(path) ? 'switchTab' : 'navigateTo';
            this.navigate(action, to);
        };
        MegaloRouter.prototype.replace = function (to) {
            if (to === void 0) { to = {}; }
            to = typeof to === "string" ? { path: to } : to;
            var path = utils_1.parseUrl(to.path || '').path;
            var action = this.tabBars.includes(path) ? 'switchTab' : 'redirectTo';
            this.navigate(action, to);
        };
        MegaloRouter.prototype.go = function (delta) {
            return __awaiter(this, void 0, void 0, function () {
                var platform;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!delta) {
                                this.reLaunch(this.currentRoute);
                            }
                            delta = -delta;
                            return [4, this.getPlatform()];
                        case 1:
                            platform = _a.sent();
                            platform.navigateBack({ delta: delta });
                            return [2];
                    }
                });
            });
        };
        MegaloRouter.prototype.back = function () {
            this.go(-1);
        };
        MegaloRouter.prototype.reLaunch = function (to) {
            if (to === void 0) { to = {}; }
            to = typeof to === "string" ? { path: to } : to;
            this.navigate('reLaunch', to);
        };
        MegaloRouter.prototype.navigate = function (action, to) {
            if (action === void 0) { action = 'navigateTo'; }
            if (to === void 0) { to = {}; }
            return __awaiter(this, void 0, void 0, function () {
                var path, _a, query, _b, success, _c, fail, _d, complete, url, platform, e_1;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            _e.trys.push([0, 3, , 4]);
                            if (!to.path)
                                throw new Error('path 不能为空');
                            path = to.path, _a = to.query, query = _a === void 0 ? {} : _a, _b = to.success, success = _b === void 0 ? function () { } : _b, _c = to.fail, fail = _c === void 0 ? function (err) {
                                err.to = to;
                                throw new Error(err);
                            } : _c, _d = to.complete, complete = _d === void 0 ? function () { } : _d;
                            url = Object.keys(query).length ? utils_1.joinQuery(path, query) : path;
                            return [4, utils_1.getMegaloRoutePath(url)];
                        case 1:
                            url = _e.sent();
                            return [4, this.getPlatform()];
                        case 2:
                            platform = _e.sent();
                            platform[action]({
                                url: url,
                                success: success,
                                fail: fail,
                                complete: complete
                            });
                            return [3, 4];
                        case 3:
                            e_1 = _e.sent();
                            throw new Error(e_1);
                        case 4: return [2];
                    }
                });
            });
        };
        MegaloRouter.prototype.getPlatform = function () {
            var _this = this;
            return new Promise(function (resolve) {
                if (_this._platform) {
                    resolve(_this._platform);
                }
                else {
                    var timer_1 = setInterval(function () {
                        if (_this._platform) {
                            resolve(_this._platform);
                            clearInterval(timer_1);
                        }
                    }, 10);
                }
            });
        };
        MegaloRouter.prototype.install = function (Vue, options) {
            var router = this;
            router.tabBars = options.tabBars || [];
            Object.defineProperty(Vue.prototype, '$router', {
                get: function () {
                    return router;
                },
                set: function () {
                    throw new Error('不能修改$router的值');
                }
            });
            Object.defineProperty(Vue.prototype, '$route', {
                get: function () {
                    return router.currentRoute;
                },
                set: function () {
                    throw new Error('不能修改$route的值');
                }
            });
            Vue.mixin({
                beforeCreate: function () {
                    if (this.$mp.page && this.$mp.page.route) {
                        var path = '/' + this.$mp.page.route;
                        router.currentRoute = {
                            query: this.$mp.options,
                            path: path,
                            fullPath: utils_1.joinQuery(path, this.$mp.options)
                        };
                    }
                    if (router._platform)
                        return;
                    var platformType = this.$mp.platform || undefined;
                    switch (platformType) {
                        case 'wechat':
                            router._platform = wx;
                            break;
                        case 'alipay':
                            router._platform = my;
                            break;
                        case 'swan':
                            router._platform = swan;
                            break;
                        default:
                            router._platform = wx;
                            throw new Error('vue-router无法识别小程序平台, 默认为wx');
                    }
                },
                onShow: function () {
                    if (this.$mp.page && this.$mp.page.route) {
                        var path = '/' + this.$mp.page.route;
                        router.currentRoute = {
                            query: this.$mp.options,
                            path: path,
                            fullPath: utils_1.joinQuery(path, this.$mp.options)
                        };
                    }
                }
            });
        };
        return MegaloRouter;
    }());
    exports.default = new MegaloRouter();
});
