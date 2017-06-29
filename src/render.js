/**
 * Render Function
 *
 * @param code
 * @param data
 * @returns {*}
 */
module.exports = function (code, data) {
    var fn = eval('function(' + Object.keys(data).join(',') + '){' + code + '}');
    return fn.apply(this, Object.values(data));
};