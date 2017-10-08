/**********************
 * Class Private This *
 **********************/

let thisMap = new WeakMap();

/**
 * @param thisArg
 * @returns {}
 */
function _private (thisArg) {
    if (thisMap.has(thisArg)) {
        return thisMap.get(thisArg);
    }
    else {
        let privateThis = {};
        thisMap.set(thisArg, privateThis);
        return privateThis;
    }
}

module.exports = _private;