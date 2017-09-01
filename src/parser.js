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
        hData = {
            attrs: {},
            props: {},
            on: {}
        },
        children = [];

    if (dom.id) {
        selector += '#' + dom.id;
    }
    if (dom.className) {
        selector += '.' + dom.className.trim().replace(/\s+/, '.');
    }

    // 解析属性
    let attributes = dom.attributes;

    let i,
        length;

    for(i = 0, length = attributes.length; i < length; i++) {
        (function (name, value) {
            let eventMatch = /^on-([a-z].*)/i.exec(name);
            let bindMatch = /^::(.*)/.exec(value);
            // Var Bind
            if (name == "name" && bindMatch && (tagName == "INPUT" || tagName == "TEXTAREA" || tagName == "SELECT")) {
                value = bindMatch[1];
                if (dom.type == 'radio') {
                    hData.attrs.name = value;
                    hData.props.checked = (dom.value == _.getObject($this.data, value));
                    hData.on.change = function (event) {
                        _.setObject($this.data, value, event.target.value);
                    }
                }
                else if (dom.type == 'checkbox') {
                    hData.props.checked = _.getObject($this.data, value);
                    hData.on.change = function (event) {
                        _.setObject($this.data, value, event.target.checked);
                    }
                }
                else {
                    hData.props.value = _.getObject($this.data, value);
                    hData.on.input = hData.on.change = function (event) {
                        _.setObject($this.data, value, event.target.value);
                    }
                }
            }
            else if (eventMatch) {
                hData.on[eventMatch[1]] = _.getObject($this.data, value, function () {}).bind($this);
            }
            else if (name != 'id' && name != 'class') {
                hData.attrs[_.toCamelCase(name)] = value;
            }
        }(attributes[i].name, attributes[i].value));
    }

    for(i = 0, length = dom.childNodes.length; i < length; i++){
        let child = dom.childNodes[i];
        if (child.nodeType == Node.TEXT_NODE) {
            children.push(child.textContent);
        }
        else {
            children.push(parseDOM.call(this, child));
        }
    }

    return h(selector, hData, children);
}

module.exports = function (html) {
    let dom = parseFromString(html);
    console.log(this);

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
