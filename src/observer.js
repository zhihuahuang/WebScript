var propStack = array();
var observers = [];

var observeObject = function fn(object) {
    for (var prop in object) {
        propStack.push(key);
        if (isObject(object)) {
            fn(object)
        }
        else {
            (function () {
                var target = propStack.join('.');
                var value = object[prop];
                Object.defineProperty(object, prop, {
                    get: function () {
                        return value;
                    },
                    set: function (val) {
                        value = val;
                        notify({
                            target: target
                        });
                    }
                });
            }());
        }
        propStack.pop();
    }
};

function attach (fn) {
    if (isFunction(fn)) {
        observers.push(fn);
    }
}

function detach (fn) {
    // TODO
}

function notify (event) {
    for (var i=0, length = observers.length; i < length; i++) {
        observers[i](event);
    }
}