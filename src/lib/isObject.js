module.exports = function (obj) {
    return toString.call(obj) === '[object Object]';
};
