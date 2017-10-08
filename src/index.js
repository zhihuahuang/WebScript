const patch = require('snabbdom').init([
    require('snabbdom/modules/class').default,
    require('snabbdom/modules/props').default,
    require('snabbdom/modules/attributes').default,
    require('snabbdom/modules/eventlisteners').default,
]);

const EventEmitter = require('events').EventEmitter;

require('./utils/polyfill');

const Template = require('./template/template');
const Observer = require('./observer/observer');
const parser2 = require('./parser/html_parser'); // 使用 htmlparser2

const _private = require('./utils/private');
const _ = require('./utils/utils');

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

        let element = options.element;
        if (!element) {
            let componentName = options.name;
            if (componentName) {
                element = document.querySelector(componentName);
                if (element) {
                    let div = document.createElement('div');

                    Array.prototype.forEach.call(element.attributes, function (attr) {
                        div.setAttribute(attr.name, attr.value);
                    });
                    div.setAttribute('data-component-name', componentName);
                    div.innerHTML = element.innerHTML;

                    element.parentNode.insertBefore(div, element);
                    element.parentNode.removeChild(element);

                    element = div;
                }
            }
            else {
                element = document.body.children[0];
            }
        }
        else if(_.isString(element)) {
            element = document.querySelector(element)
        }

        _this.classes = options.classes || {};
        _this.style = options.style || {};
        _this.attrs = options.attrs || {};
        _this.props = options.props || {};
        _this.on = options.on || {};

        _this.isOnVisibilityChange = false;

        let html = element.outerHTML.replace(/&lt;/ig, '<').replace(/&gt;/ig, '>');

        // 是否压缩代码
        let removeHTMLWhitespace = _.getObject(options, 'config.removeHTMLWhitespace', true);
        if (removeHTMLWhitespace) {
            html = html.replace(/([a-z%]>|\s%>)\s+(<[a-z]|<%\s)/igm, '$1$2');
        }

        _this.template = new Template(html);
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

        _this.emitter = new EventEmitter;

        $this.element = element;
        $this.data = observer.target;

        $this.render();
    }

    render() {
        let $this = this;
        let _this = _private($this);

        if (_this.isRenderPending) {
            return;
        }

        _this.isRenderPending = true;

        //_.nextTick(function renderNextTick() {
            let data = _this.observer.target;

            let html = _this.template.render(data);

            data = null;

            let vnodeTemp = parser2.call($this, html);

            html = null;

            patch(_this.vnode || $this.element, vnodeTemp);

            _this.vnode = vnodeTemp;

            vnodeTemp = null;

            _this.isRenderPending = false;

            _this.emitter.emit('render');
        //});
    }

    on(event, listener) {
        let $this = this;
        _private($this).emitter.addListener(event, function() {
            listener.apply($this, arguments);
        });
        return $this;
    }

    off(event, listener) {
        _private(this).emitter.removeListener(event, listener);
    }

    emit(event, ...args) {
        _private(this).emitter.emit(event, ...args);
    }
}

window.WebScript = WebScript;