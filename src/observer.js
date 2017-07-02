var isFunction = require('./lib/isFunction');
var isObject = require('./lib/isObject');

module.exports = function Observer(obj) {
    var subscribes = [];
    var propStack = [];

    var observe = function fn(object, path) {
        for (var prop in object) {
            (function () {
                var target = (path || '') + '["' + prop + '"]';
                var value = object[prop];

                if (isObject(value)) {
                    fn(value, target);
                }

                Object.defineProperty(object, prop, {
                    get: function () {
                        return value;
                    },
                    set: function (val) {
                        if (isObject(val)) {
                            fn(val, target);
                        }
                        value = val;
                        notify({
                            target: target
                        });
                    }
                });
            }());
        }
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

    observe(obj);

    return {
        attach: attach,
        detach: detach
    };
};