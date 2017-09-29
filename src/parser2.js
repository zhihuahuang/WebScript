const h = require('snabbdom/h').default;
const Parser = require('htmlparser2/lib/Parser');

const _ = require('./utils');

let $this;
let element;

let parser = new Parser({
    onopentag: function (tagName, attributes) {
        tagName = tagName.toUpperCase();

        element = {
            selector: tagName,
            data: {
                attrs: {},
                props: {},
                on: {},
            },
            childrens: [],
            parent: element
        };

        for (let attrName in attributes) {
            let attrValue = attributes[attrName];

            let eventMatch = /^on-([a-z].*)/i.exec(attrName);

            // Event
            if (eventMatch) {
                let eventName = eventMatch[1];
                element.data.on[eventName] = _.getObject($this.data, attrValue, function () {}).bind($this);
            }
            // Attr
            else {
                switch (attrName) {
                    case 'id':
                        element.selector += '#' + attrValue.trim();
                        break;

                    case 'class':
                        let className = attrValue.trim();
                        if (className) {
                            element.selector += '.' + className.replace(/\s+/, '.');
                        }
                        break;

                    case 'bind':
                        if (tagName == 'INPUT' && attributes.type == 'radio') {
                            element.data.props.checked = (attributes.value == _.getObject($this.data, attrValue));
                            element.data.on.change = function (event) {
                                console.log(event.target);
                                _.setObject($this.data, attrValue, event.target.value);
                            };
                        }
                        else if (tagName == 'INPUT' && attributes.type == 'checkbox') {
                            element.data.props.checked = (attributes.value == _.getObject($this.data, attrValue));
                            element.data.on.change = function (event) {
                                _.setObject($this.data, attrValue, event.target.checked);
                            };
                        }
                        else {
                            element.data.props.value = _.getObject($this.data, attrValue);
                            element.data.on.input = element.data.on.change = function (event) {
                                _.setObject($this.data, attrValue, event.target.value);
                            };
                        }
                        break;

                    default:
                        element.data.attrs[attrName] = attrValue;
                }
            }
        }
    },

    ontext: function (text) {
        element.childrens.push(text);
    },

    onclosetag: function () {
        element.parent.childrens.push(h(element.selector, element.data, element.childrens));
        element = element.parent;
    }
}, {
    lowerCaseTags: false
});

function parseHTML(html) {
    element = {
        childrens: []
    };

    $this = this;

    parser.write(html);

    return element.childrens[0];
}

module.exports = parseHTML;