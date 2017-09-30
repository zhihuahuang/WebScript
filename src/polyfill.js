var self = global || window;

/**
 * String.prototype.at Polyfill
 */
if (!String.prototype.at) {
    String.prototype.at = String.prototype.charAt;
}

/**
 * Array.isArray Polyfill
 */
if (!Array.isArray) {
    Array.isArray = function (arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}

/**
 * Object.values Polyfill
 */
if (!Object.values) {
    Object.values = function (arg) {
        var vals = [];
        for (var key in arg) {
            vals.push(arg[key]);
        }
        return vals;
    }
}

/**
 * Object.setPrototypeOf Polyfill
 */
if (!Object.setPrototypeOf) {
    Object.setPrototypeOf = function(obj, proto) {
        obj.__proto__ = proto;
        return obj;
    }
}

/**
 * WeakMap Polyfill
 */
if (!self.WeakMap) {
    (function () {
        var publicMaps = [];
        var privateMaps = [];

        function getPrivateMap(thisArg) {
            return privateMaps[publicMaps.indexOf(thisArg)];
        }

        function WeakMap() {
            publicMaps.unshift(this);
            privateMaps.unshift({
                keys: [],
                vals: []
            });
        }

        WeakMap.prototype.has = function (key) {
            return getPrivateMap(this).keys.indexOf(key) >= 0;
        };

        WeakMap.prototype.get = function (key) {
            var map = getPrivateMap(this);
            var index = map.keys.indexOf(key);
            return index >=0 ? map.vals[index] : undefined;
        };

        WeakMap.prototype.set = function (key, value) {
            var map = getPrivateMap(this);
            var index = map.keys.indexOf(key);
            if (index >= 0) {
                map.vals[index] = value;
            }
            else {
                map.keys.unshift(key);
                map.vals.unshift(value);
            }
            return this;
        };

        self.WeakMap = WeakMap;

    }());
}



