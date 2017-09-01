require('raf').polyfill(); // requestAnimationFrame

/*
 * DOMParser HTML extension
 * 2012-09-04
 *
 * By Eli Grey, http://eligrey.com
 * Public domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*! @source https://gist.github.com/1129031 */
/*global document, DOMParser*/

(function(DOMParser) {
    var proto = DOMParser.prototype,
        nativeParse = proto.parseFromString;

    // Firefox/Opera/IE throw errors on unsupported types
    try {
        // WebKit returns null on unsupported types
        if ((new DOMParser()).parseFromString("", "text/html")) {
            // text/html parsing is natively supported
            return;
        }
    }
    catch (e) {
    }

    proto.parseFromString = function(markup, type) {
        if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
            var doc = document.implementation.createHTMLDocument("");
            if (markup.toLowerCase().indexOf('<!doctype') > -1) {
                doc.documentElement.innerHTML = markup;
            }
            else {
                doc.body.innerHTML = markup;
            }
            return doc;
        }
        else {
            return nativeParse.apply(this, arguments);
        }
    };
}(DOMParser));

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



