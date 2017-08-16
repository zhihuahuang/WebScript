const patch = require('snabbdom').init([ // Init patch function with chosen modules
    require('snabbdom/modules/class').default, // makes it easy to toggle classes
    require('snabbdom/modules/props').default, // for setting properties on DOM elements
    //require('snabbdom/modules/style').default, // handles styling on elements with support for animations
    require('snabbdom/modules/eventlisteners').default, // attaches event listeners
]);
const h = require('snabbdom/h').default; // helper function for creating vnodes

require('raf'); // requestAnimationFrame

const Template = require('./template');
const Observer = require('./observer');
const parser = require('./parser');

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

const HIDDEN = ['hidden', 'mozHidden', 'webkitHidden'];

/**
 * document.hidden
 *
 * @returns {*}
 */
function documentHidden() {
    for (let hidden of HIDDEN) {
        if (hidden in document) {
            return document[hidden];
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

const EVENT_VISIBILITY_CHANGE = 'visibilitychange';

window.WebScript = function (options) {
    __classCallCheck(this, WebScript);

    let element;

    options = options || {};
    if ('root' in options) {
        element = options.root;
    }
    else {
        element = document.body.children[0];
    }

    let template = new Template(element.outerHTML.replace(/&lt;/ig, '<').replace(/&gt;/ig, '>'));

    let observer = new Observer(options.data || {});

    let vnode;

    let isOnVisibilityChange= false;
    let frame = null;

    observer.attach(function () {
        // 如果页面被隐藏了，则减少重绘
        if (documentHidden()) {
            if (!isOnVisibilityChange) {
                addEventListener(document, EVENT_VISIBILITY_CHANGE, function fn () {
                    removeEventListener(document, EVENT_VISIBILITY_CHANGE, fn);
                    isOnVisibilityChange = false;
                    redraw();
                });
                isOnVisibilityChange = true;
            }
        }
        else {
            redraw();
        }
    });

    redraw();

    return {
        data: observer.target,
        on: function () {
            
        }
    };

    function redraw() {
        if (frame) {
            return;
        }

        frame = requestAnimationFrame(function () {
            let data = observer.target;

            let html = template.render(data);

            let vnodeTemp = parser(html, data, h);

             patch(vnode || element, vnodeTemp);

            vnode = vnodeTemp;

            vnodeTemp = null;

            frame = null;
        });
    }
};