var isFunction = require('./lib/isFunction');
var isObject = require('./lib/isObject');
var isArray = require('./lib/isArray');

var METHODS = ['fill', 'push', 'pop', 'reverse', 'shift', 'splice', 'sort', 'unshift'];

module.exports = function Observer(obj) {
    var subscribes = [];

    recurseObject(obj);

    return {
        attach: attach,
        detach: detach
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
        for (var i=0, length = subscribes.length; i < length; i++) {
            subscribes[i](event);
        }
    }

    function defineProperty (object, prop, target) {
        var value = object[prop];

        Object.defineProperty(object, prop, {
            get: function () {
                return value;
            },
            set: function (val) {
                if (isObject(val)) {
                    recurseObject(val, target);
                }
                value = val;
                notify({
                    target: target
                });
            }
        });
    }
//
    function recurseObject (object, target) {
        for (var prop in object) {
            var value = object[prop];

            defineProperty(object, prop);

            if (isObject(value)) {
                recurseObject(value, (target || '') + '["' + prop + '"]');
            }
            else if (isArray(value)) {
                recurseArray(value, (target || '') + '["' + prop + '"]');
            }
        }
    }

    function recurseArray (array, target) {
        METHODS.forEach(function (name) {
            var fn = array[name];
            Object.defineProperty(array, name, {
                value: function () {
                    var returnValue = fn.apply(this, arguments);
                    notify({
                        target: target
                    });
                    return returnValue;
                }
            });
        });
    }
};