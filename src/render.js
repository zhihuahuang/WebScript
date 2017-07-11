/**
 * Render Function
 *
 * @param code
 * @param data
 * @returns {*}
 */
module.exports = function (code, data) {
    var fn;
    code = 'fn=function(' + Object.keys(data).join(',') + '){' + code + '}';
    eval(code);
    return fn.apply(this, Object.values(data));
};