/**
 * Render Function
 *
 * @param code
 * @param data
 * @returns {*}
 */
module.exports = function (code, data) {
    var code = 'function(' + Object.keys(data).join(',') + '){' + code + '}';
    var fn;
    eval('fn=' + code);
    return fn.apply(this, Object.values(data));
};