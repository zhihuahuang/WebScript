const patch = require('snabbdom').init([
    require('snabbdom/modules/class').default,
    require('snabbdom/modules/props').default,
    require('snabbdom/modules/attributes').default,
    require('snabbdom/modules/eventlisteners').default,
]);

const EventEmitter = require('eventemitter3');

require('./polyfill');

const Template = require('./template');
const Observer = require('./observer');
const parser = require('./parser');
const _private = require('./private');

const HIDDEN = ['hidden', 'mozHidden', 'webkitHidden'];

/**
 * document.hidden
 *
 * @returns {*}
 */
function documentHidden() {
    for (let i=0; i < HIDDEN.length; i++) {
        if (HIDDEN[i] in document) {
            return document[HIDDEN[i]];
        }
    }
    return false;
}

const EVENT_VISIBILITY_CHANGE = 'visibilitychange';

class WebScript {

    constructor (options = {}) {
        let $this = this;
        let _this = _private(this);

        let element;
        if('root' in options) {
            element = options.root
        }
        else {
            element = document.body.children[0];
        }

        _this.classes = options.classes || {};
        _this.style = options.style || {};
        _this.attrs = options.attrs || {};
        _this.props = options.props || {};
        _this.on = options.on || {};

        _this.isOnVisibilityChange = false;

        _this.template = new Template(element.outerHTML.replace(/&lt;/ig, '<').replace(/&gt;/ig, '>'));
        let observer = _this.observer = new Observer(options.data || {});

        observer.attach(function () {
            // 如果页面被隐藏了，则减少重绘
            if (documentHidden()) {
                if (!_this.isOnVisibilityChange) {
                    document.addEventListener(EVENT_VISIBILITY_CHANGE, function handler() {
                        document.removeEventListener(EVENT_VISIBILITY_CHANGE, handler);
                        _this.isOnVisibilityChange = false;
                        $this.render();
                    });

                    _this.isOnVisibilityChange = true;
                }
            }
            else {
                $this.render();
            }
        });

        $this.render();

        _this.emitter = new EventEmitter;

        $this.element = element;
        $this.data = observer.target;
    }

    render() {
        let $this = this;
        let _this = _private($this);

        if (_this.frame) {
            return;
        }

        _this.frame = requestAnimationFrame(function () {
            let data = _this.observer.target;

            let html = _this.template.render(data);

            let vnodeTemp = parser.call($this, html);

            patch(_this.vnode || $this.element, vnodeTemp);

            _this.vnode = vnodeTemp;

            vnodeTemp = null;

            _this.frame = null;
        });
    }

    on(event, listener) {
        _private(this).emitter.addListener(event, listener);
        return this;
    }

    off(event, listener) {
        _private(this).emitter.removeListener(event, listener);
    }
}

window.WebScript = WebScript;