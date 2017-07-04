var isFunction = require('./lib/isFunction');
var isObject = require('./lib/isObject');
var isArray = require('./lib/isArray');

module.exports = function Observer(obj) {
    var subscribes = [];
    var observe = function fn(object, path) {
        for (var prop in object) {
            (function () {
                var target = (path || '') + '["' + prop + '"]';
                var value = object[prop];

                if (isObject(value)) {
                    fn(value, target);
                }

                if (isArray(value)) {
                    var names = ['fill', 'push', 'pop', 'reverse', 'shift', 'splice', 'sort', 'unshift'];
                    for (var i = 0, length = names.length; i < length; i++) {
                        (function (array, name) {
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
                        }(value, names[i]));
                    }
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
            (function(fn) {
                setTimeout(function() {
                    fn(event);
                }, 0);
            }(subscribes[i]));
        }
    }

    observe(obj);

    return {
        attach: attach,
        detach: detach
    };
};