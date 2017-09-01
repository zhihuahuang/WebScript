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

module.exports = {
    isString,
    isArray,
    isObject,
    isFunction,
    each,
    getObject,
    setObject,
    toCamelCase
};