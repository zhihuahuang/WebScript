var snabbdom = require('snabbdom');
var patch = snabbdom.init([ // Init patch function with chosen modules
  require('snabbdom/modules/class').default, // makes it easy to toggle classes
  require('snabbdom/modules/props').default, // for setting properties on DOM elements
  require('snabbdom/modules/style').default, // handles styling on elements with support for animations
  require('snabbdom/modules/eventlisteners').default // attaches event listeners
]);
var h = require('snabbdom/h').default; // helper function for creating vnodes

var tokenizer = require('./tokenizer');
var render = require('./render');
var Observer = require('./observer');

var dom2script = require('dom2hscript');

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

    var code = tokenizer(element.outerHTML.replace(/&lt;/ig, '<').replace(/&gt;/ig, '>'));

    var observer = new Observer(data);
    var vnode;

    observer.attach(repatch);

    repatch();
    
    function repatch() {
        var html = render(code, data);

        var hyerscript = dom2script.parseHTML(html);

        var _vnode = eval(hyerscript);

        patch(vnode || element, _vnode);

        vnode = _vnode;
    }
};