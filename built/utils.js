define(["require", "exports"], function (require, exports) {
    "use strict";
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
    exports.getCurrentRoute = function () {
        var pages = getCurrentPages();
        return pages[pages.length - 1].route;
    };
    exports.getMegaloRoutePath = function (pathB) {
        var pathA = exports.getCurrentRoute();
        var toTop = pathA.split('/').reduce(function (res, val, index, arr) {
            if (index === arr.length - 1 || !val)
                return res;
            return '../' + res;
        }, '');
        return (toTop + pathB).replace(/\/\//g, '/');
    };
});
