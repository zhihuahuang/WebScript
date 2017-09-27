const h = require('snabbdom/h').default;

const _ = require('./utils');
const _private = require('./private');

let domParser = new DOMParser();

function parseFromString(string) {
    let doc = domParser.parseFromString(string, 'text/html');
    return doc.body.firstChild;
}

function parseDOM (dom) {
    let $this = this;

    let tagName = dom.tagName,
        selector = tagName,
        data = {
            attrs: {},
            props: {},
            on: {}
        },
        children = [];

    let bindVar = null;

    // 测试 forEach 性能最好
    Array.prototype.forEach.call(dom.attributes, function (attr) {
        let attrName = attr.name,
            attrValue = attr.value;

        let eventMatch = /^on-([a-z].*)/i.exec(attrName);

        // Event
        if (eventMatch) {
            let eventName = eventMatch[1];
            data.on[eventName] = _.getObject($this.data, attrValue, function () {}).bind($this);
        }
        // Attr
        else {
            switch (attrName) {
                case 'id':
                    selector += '#' + attr.value.trim();
                    break;

                case 'class':
                    let className = attr.value.trim();
                    if (className) {
                        selector += '.' + className.replace(/\s+/, '.');
                    }
                    break;

                case 'bind':
                    bindVar = attrValue;
                    break;

                default:
                    data.attrs[attrName] = attrValue;
            }
        }
    });

    if (bindVar && (/^INPUT|TEXTAREA|SELECT$/.test(tagName) || data.attrs.contenteditable === 'true')) {
        if (tagName == 'INPUT' && data.attrs.type == 'radio') {
            data.props.checked = (data.attrs.value == _.getObject($this.data, bindVar));
            data.on.change = function (event) {
                console.log(event.target);
                _.setObject($this.data, bindVar, event.target.value);
            };
        }
        else if (tagName == 'INPUT' && data.attrs.type == 'checkbox') {
            data.props.checked = (data.attrs.value == _.getObject($this.data, bindVar));
            data.on.change = function (event) {
                _.setObject($this.data, bindVar, event.target.checked);
            };
        }
        else {
            data.props.value = _.getObject($this.data, bindVar);
            data.on.input = data.on.change = function (event) {
                _.setObject($this.data, bindVar, event.target.value);
            };
        }
    }

    let childLength = dom.childNodes.length;

    if (childLength > 1) {
        let child = dom.firstChild;

        while(child !== null) {
            if (child.nodeType === Node.TEXT_NODE) {
                children.push(child.textContent);
            }
            else {
                children.push(parseDOM.call(this, child));
            }
            child = child.nextSibling; // 某些浏览器下 nextSibling 的性能比 childNodes 更好一些
        }
    }
    else if (childLength == 1) {
        let child = dom.firstChild;

        if (child.nodeType === Node.TEXT_NODE) {
            children.push(child.textContent);
        }
        else {
            children.push(parseDOM.call(this, child));
        }
    }

    return h(selector, data, children);
}

module.exports = function (html) {
    let dom = parseFromString(html);

    /* Class */
    parseSelector.apply(this, [dom, _private(this).classes, function (element, name, value) {
        if (value) {
            element.classList.add(name);
        }
    }]);

    /* Style */
    parseSelector.apply(this, [dom, _private(this).style, function (element, name, value) {
        element.style[name] = value;
    }]);

    /* Attr */
    parseSelector.apply(this, [dom, _private(this).attrs, function (element, name, value) {
        if (value || !/^hidden|disabled$/i.test(name)) {
            element.setAttribute(name, value);
        }
    }]);

    /* Prop */
    parseSelector.apply(this, [dom, _private(this).props, function (element, name, value) {
        element[name] = value;
    }]);

    return parseDOM.call(this, dom);
};

function parseSelector (dom, selectores, handler) {
    for (let selector in selectores) {
        let elementList = dom.querySelectorAll(selector);

        if (elementList.length > 0) {
            for (let name in selectores[selector]) {
                let value = selectores[selector][name];

                if (_.isFunction(value)) {
                    value = value.call(this);
                }

                _.each(elementList, function (element) {
                    handler.apply(this, [element, name, value]);
                });
            }
        }
    }
}
