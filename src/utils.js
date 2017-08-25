function isType (value, type) {
    return Object.prototype.toString.call(value) === `[object ${type}]`;
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

module.exports = {
    isArray,
    isObject,
    isFunction
};