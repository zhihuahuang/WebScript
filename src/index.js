var snabbdom = require('snabbdom');
var patch = snabbdom.init([ // Init patch function with chosen modules
    require('snabbdom/modules/props').default,
    require('snabbdom/modules/attributes').default, // for setting properties on DOM elements
    require('snabbdom/modules/eventlisteners').default // attaches event listeners
]);
var h = require('snabbdom/h').default; // helper function for creating vnodes

var Compiler = require('./compiler');
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

/**
 * document.hidden
 *
 * @returns {*}
 */
function documentHidden() {
    var props = ['hidden', 'mozHidden', 'webkitHidden'];
    for (var i = 0, length = props.length; i < length; i++) {
        if (props[i] in document) {
            return document[props[i]];
        }
    }
    return false;
}

function addEventListener(element, event, handler) {
    event.trim().split(/\s+/).forEach(function (name) {
        element.addEventListener(name, handler);
    });
}

function removeEventListener(element, event, handler) {
    event.trim().split(/\s+/).forEach(function (name) {
        element.removeEventListener(name, handler);
    });
}

window.WebScript = function (options) {
    __classCallCheck(this, WebScript);

    var element;

    options = options || {};
    if ('root' in options) {
        element = options.root;
    }
    else {
        element = document.body.children[0];
    }

    var template = element.outerHTML.replace(/&lt;/ig, '<').replace(/&gt;/ig, '>');

    var compiler = new Compiler(template);

    var code = compiler.getCode();

    var observer = new Observer(options.data || {});

    var vnode;
    var timer;
    var visibilitychangeListener;

    observer.attach(redraw);

    redraw();

    return {
        data: observer.target,
        on: function () {
            
        }
    };

    function redraw() {
        var html = render(code, options.data);

        var vnodeTemp = parser(html, options.data, h);

        // 如果页面被隐藏了，则减少重绘
        if (documentHidden()) {
            if (!visibilitychangeListener) {
                addEventListener(document, 'visibilitychange', function fn () {
                    removeEventListener(document, 'visibilitychange', fn);
                    visibilitychangeListener();
                    visibilitychangeListener = null;
                });
            }

            visibilitychangeListener = function () {
                repatch(vnodeTemp);
            };
        }
        else {
            repatch(vnodeTemp);
        }
    }

    /**
     * @param newVnode
     */
    function repatch(newVnode) {
         if (timer) {
            cancelAnimationFrame(timer);
        }

        timer = requestAnimationFrame(function() {
            timer = null;
            patch(vnode || element, newVnode);
            vnode = newVnode;
        });
    }
};