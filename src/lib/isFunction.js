module.exports = function (fn) {
    return toString.call(fn) === '[object Function]';
};
