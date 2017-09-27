const EventEmitter = require('events').EventEmitter;

const METHODS = ['fill', 'push', 'pop', 'reverse', 'shift', 'splice', 'sort', 'unshift'];
const EVENT_DATA_CHANGE = 'datachange';

const IS_SUPPORT_PROXY = !!(global || self).Proxy;

if (!IS_SUPPORT_PROXY) {
    require('proxy-polyfill/proxy.min');
}

const _ = require('./utils');

const _private = require('./private');

class Observer {
    
    constructor (data) {
        let $this = this;
        let _this = _private($this);

        _this.emitter = new EventEmitter();

        // Handler
        let handler = {
            set(target, property, value) {
                target[property] = value;
                notify.call(_this);
                return true;
            }
        };

        if (IS_SUPPORT_PROXY) {
            handler['deleteProperty'] = function (target, property) {
                delete target[property];
                notify.call(_this);
                return true;
            }
        }

       this.target = proxy(data, handler);
    }

    attach (handler) {
        _private(this).emitter.on(EVENT_DATA_CHANGE, handler);
    }

    detach (handler) {
        _private(this).emitter.removeListener(EVENT_DATA_CHANGE, handler);
    }
}

/**
 * @private
 *
 * @param target
 * @param property
 * @param value
 */
function notify (target, property, value) {
    let _this = this;
    if(_this.isNotifyPending) {
        return;
    }

    _this.isNotifyPending = true;
    _.nextTick(function () {
        _this.isNotifyPending = false;
        _this.emitter.emit(EVENT_DATA_CHANGE, target, property, value);
    });
}

module.exports = Observer;

/**
 *
 * @param target
 * @param handler
 * @returns {*}
 */
function proxy (target, handler) {
    if (_.isArray(target)) {
        target = proxyArray(target, handler);
    }
    else if (_.isObject(target)) {
        target = proxyObject(target, handler);
    }

    return target;
}

/**
 * @param obj
 * @param handler
 * @returns {Proxy}
 */
function proxyObject (obj, handler) {
    for(let prop in obj) {
        obj[prop] = proxy(obj[prop], handler);
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
    array.forEach(function (value, index) {
        if(_.isObject(value)) {
            array[index] = new Proxy(value, handler);
        }
    });
    if (IS_SUPPORT_PROXY) {
        array.forEach(function (value, index) {
            if(_.isObject(value)) {
                array[index] = new Proxy(value, handler);
            }
        });
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
        return array;
    }
}