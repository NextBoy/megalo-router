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
define(["require", "exports"], function (require, exports) {
    "use strict";
    var _this = this;
    Object.defineProperty(exports, "__esModule", { value: true });
    function joinQuery(url, query) {
        var keys = Object.keys(query);
        if (!keys.length) {
            return url;
        }
        else {
            var pairs = keys.map(function (key) { return key + "=" + query[key]; });
            url = /\?/g.test(url) ? url + "&" : url + "?";
            url += pairs.join('&');
            return url;
        }
    }
    exports.joinQuery = joinQuery;
    function parseUrl(fullPath) {
        var path = fullPath;
        var query = {};
        if (/\?/g.test(fullPath)) {
            path = fullPath.split('?')[0];
            var queryString = fullPath.split('?')[1];
            var pairs = queryString.split('&');
            pairs.forEach(function (pair) {
                var pairArr = pair.split('=');
                query[pairArr[0]] = pairArr[1] || '';
            });
        }
        return {
            path: path,
            query: query,
            fullPath: fullPath
        };
    }
    exports.parseUrl = parseUrl;
    function deepClone(obj) {
        var objClone = Array.isArray(obj) ? [] : {};
        if (obj && typeof obj === 'object') {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (obj[key] && typeof obj[key] === 'object') {
                        objClone[key] = deepClone(obj[key]);
                    }
                    else {
                        objClone[key] = obj[key];
                    }
                }
            }
        }
        return objClone;
    }
    exports.deepClone = deepClone;
    exports.getCurrentRoute = function () { return __awaiter(_this, void 0, void 0, function () {
        var queryRoute;
        return __generator(this, function (_a) {
            queryRoute = function () {
                var pages = getCurrentPages();
                if (!pages[pages.length - 1])
                    return false;
                return pages[pages.length - 1].route;
            };
            return [2, new Promise(function (resolve) {
                    if (queryRoute()) {
                        resolve(queryRoute());
                    }
                    else {
                        var timer_1 = setInterval(function () {
                            if (queryRoute()) {
                                resolve(queryRoute());
                                clearInterval(timer_1);
                            }
                        }, 10);
                    }
                })];
        });
    }); };
    exports.getMegaloRoutePath = function (pathB) { return __awaiter(_this, void 0, void 0, function () {
        var pathA, toTop;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, exports.getCurrentRoute()];
                case 1:
                    pathA = _a.sent();
                    toTop = pathA.split('/').reduce(function (res, val, index, arr) {
                        if (index === arr.length - 1 || !val)
                            return res;
                        return '../' + res;
                    }, '');
                    return [2, Promise.resolve((toTop + pathB).replace(/\/\//g, '/'))];
            }
        });
    }); };
});
