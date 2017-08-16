var isFunction = require('./lib/isFunction');
var isObject = require('./lib/isObject');
var isArray = require('./lib/isArray');

const METHODS = ['fill', 'push', 'pop', 'reverse', 'shift', 'splice', 'sort', 'unshift'];

var isSupportProxy = !!(global || self).Proxy;

if (!isSupportProxy) {
    require('proxy-polyfill/proxy.min');
}

module.exports = function Observer(target) {
    var subscribes = [];

    target = proxyObject(target, {
        set: function (target, prop, value) {
            target[prop] = value;
            notify(target, prop, value);
            return true;
        }
    });

    return {
        attach: attach,
        detach: detach,
        target: target
    };

    function attach (fn) {
        if (isFunction(fn)) {
            subscribes.push(fn);
        }
    }

    function detach (fn) {
        // TODO
    }

    function notify (event) {
        for (let i=0; i < subscribes.length; i++) {
            subscribes[i](event);
        }
    }
};

/**
 * @param obj
 * @param handler
 * @returns {Proxy}
 */
function proxyObject (obj, handler) {
    for(let prop in obj) {
        if (isArray(obj[prop])) {
            obj[prop] = proxyArray(obj[prop], handler);
        }
        else if (isObject(obj[prop])) {
            obj[prop] = proxyObject(obj[prop], handler);
        }
    }

    return new Proxy(obj, handler);
}

/**
 *
 * @param array
 * @param handler
 * @returns {*}
 */
function proxyArray (array, handler) {
    if (isSupportProxy) {
        return new Proxy(array, handler);
    }
    else {
        METHODS.forEach(function (name) {
            let fn = array[name];
            Object.defineProperty(array, name, {
                value: function () {
                    let returnValue = fn.apply(this, arguments);
                    handler.set(array, 'length', array.length, array);
                    return returnValue;
                }
            });
        });
    }
}