function emptyFunction () {
}

function isType (value, type) {
    return Object.prototype.toString.call(value) === `[object ${type}]`;
}

function isString (string) {
    return isType(string, 'String');
}

function isArray (array) {
    return Array.isArray(array);
}

function isObject (object) {
    return isType(object, 'Object');
}

function isFunction (fn) {
    return isType(fn, 'Function');
}

function toString (value) {
    return '' + value;
}

function each (list, fn) {
    Array.prototype.forEach.call(list, fn);
}

function parseProp(prop) {
    let propList = [];

    let match,
        pattern = /\[['"](.+?)['"]\]|\.(.+?)|^([^.[]+)/g;

    while(match = pattern.exec(prop)) {
        propList.push(match[1] || match[2] || match[3]);
    }

    return propList;
}

function getObject (object, prop, defaultValue) {
    let propList = parseProp(prop);

    for(let i = 0, length = propList.length; i < length; i++) {
        if (propList[i] in object) {
            object = object[propList[i]];
        }
        else {
            return defaultValue;
        }
    }
    return object;
}

function setObject (object, prop, value) {
    let propList = parseProp(prop);

    for(let i = 0, length = propList.length; i < length; i++) {
        if (i == length-1) {
            object[propList[i]] = value;
        }
        else {
            object = object[propList[i]];
        }
    }
}

function toCamelCase (name) {
    return name.replace(/-([a-z])/ig, function ($0, $1) {
        return $1.toUpperCase();
    });
}

/**
 * Checks if `value` is a native code.
 *
 * @param object
 * @returns {boolean}
 */
function isNative (object) {
    return isFunction(object) && /native code/.test(object.toString());
}

/**
 * Implement like nodejs process.nextTick
 *
 * @param {function} callback
 * @return {undefined}
 */
const nextTick = (function () {
    if (typeof Promise !== 'undefined' && isNative(Promise)) {
        return function (callback) {
            Promise.resolve().then(callback);
        };
    }
    else if ( typeof MutationObserver !== 'undefined' && isNative(MutationObserver)) {
        let counter = 1;
        let textNode = document.createTextNode(toString(counter));
        let mutationCallback = emptyFunction;

        let mutationObserver = new MutationObserver(function () {
            mutationCallback();
        });
        mutationObserver.observe(textNode, {
            characterData: true
        });

        return function (callback) {
            mutationCallback = isFunction(callback) ? callback : emptyFunction;
            textNode.data = (counter + 1) % 2;
        };
    }
    else {
        return function (callback) {
            setTimeout(callback, 0);
        };
    }
}());

module.exports = {
    isString,
    isArray,
    isObject,
    isFunction,
    each,
    getObject,
    setObject,
    toCamelCase,
    nextTick,
};