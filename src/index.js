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
var observer = require('./observer');

function WebScript(data, options) {
    __classCallCheck(this, WebScript);

    var element;

    options = options || {};
    if ('root' in options) {
        element = options.root;
    }
    else {
        element = document.body;
    }

    this.data = observer(data);

    this.code = tokenizer(element.outerHTML);

    var html = render(this.code, data);

    var hscript = html2hscript(html);

    var vnode = eval(hscript);

    patch(element, vnode);
}

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

window.WebScript = WebScript;