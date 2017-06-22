var snabbdom = require('snabbdom');
var patch = snabbdom.init([ // Init patch function with chosen modules
  require('snabbdom/modules/class').default, // makes it easy to toggle classes
  require('snabbdom/modules/props').default, // for setting properties on DOM elements
  require('snabbdom/modules/style').default, // handles styling on elements with support for animations
  require('snabbdom/modules/eventlisteners').default, // attaches event listeners
]);
var h = require('snabbdom/h').default; // helper function for creating vnodes

var template = require('./template');
var compiler = require('./compiler');
var rootElement,
    code,
    _data;

function init() {
    rootElement = document.body.children[0];
    code = template(rootElement.outerHTML);
}

function render() {
    var templateFunction = function () { throw new Error() };
    eval('templateFunction = function(' + Object.keys(_data).join(',') + '){' + code + '}');
    var html = templateFunction.apply(this, Object.values(_data));
    var hscript = compiler(html);
    eval('var vnode = ' + hscript);
    patch(rootElement, vnode);
}

function WebScript(data) {
    _data = data;
    init();
    render();
    // Test
    setInterval(render, 1000);
}

window.WebScript = WebScript;