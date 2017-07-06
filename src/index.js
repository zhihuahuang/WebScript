var snabbdom = require('snabbdom');
var patch = snabbdom.init([ // Init patch function with chosen modules
    require('snabbdom/modules/props').default,
    require('snabbdom/modules/attributes').default, // for setting properties on DOM elements
    require('snabbdom/modules/eventlisteners').default // attaches event listeners
]);
var h = require('snabbdom/h').default; // helper function for creating vnodes

var compiler = require('./compiler');
var render = require('./render');
var Observer = require('./observer');
var parser = require('./parser');

/**
 * From Babel
 *
 * @param instance
 * @param Constructor
 * @private
 */
function __classCallCheck(instance, Constructor) {
    // check if we create a new Object
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

window.WebScript = function (data, options) {
    __classCallCheck(this, WebScript);

    var element;

    options = options || {};
    if ('root' in options) {
        element = options.root;
    }
    else {
        element = document.body.children[0];
    }

    var code = compiler(element.outerHTML.replace(/&lt;/ig, '<').replace(/&gt;/ig, '>'));

    var observer = new Observer(data);
    var vnode;

    observer.attach(repatch);

    repatch();
    
    function repatch() {
        var html = render(code, data);

        var hyerscript = parser(html);

        var _vnode = eval(hyerscript);

        patch(vnode || element, _vnode);

        vnode = _vnode;
    }
};