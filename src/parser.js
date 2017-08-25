/*
 * DOMParser HTML extension
 * 2012-09-04
 *
 * By Eli Grey, http://eligrey.com
 * Public domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*! @source https://gist.github.com/1129031 */
/*global document, DOMParser*/

(function(DOMParser) {
    "use strict";

    var
        proto = DOMParser.prototype
        , nativeParse = proto.parseFromString
    ;

    // Firefox/Opera/IE throw errors on unsupported types
    try {
        // WebKit returns null on unsupported types
        if ((new DOMParser()).parseFromString("", "text/html")) {
            // text/html parsing is natively supported
            return;
        }
    } catch (ex) {}

    proto.parseFromString = function(markup, type) {
        if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
            var
                doc = document.implementation.createHTMLDocument("")
            ;
            if (markup.toLowerCase().indexOf('<!doctype') > -1) {
                doc.documentElement.innerHTML = markup;
            }
            else {
                doc.body.innerHTML = markup;
            }
            return doc;
        } else {
            return nativeParse.apply(this, arguments);
        }
    };
}(DOMParser));

let domParser = new DOMParser();

function parseFromString(string) {
    let doc = domParser.parseFromString(string, 'text/html');
    return doc.body.firstChild;
}

function parseDOM (dom, data, h) {
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
                    hData.props.checked = (dom.value == getObject(data, value));
                    hData.on.change = function (event) {
                        setObject(data, value, event.target.value);
                    }
                }
                else if (dom.type == 'checkbox') {
                    hData.props.checked = getObject(data, value);
                    hData.on.change = function (event) {
                        setObject(data, value, event.target.checked);
                    }
                }
                else {
                    hData.props.value = getObject(data, value);
                    hData.on.input = hData.on.change = function (event) {
                        setObject(data, value, event.target.value);
                    }
                }
            }
            else if (eventMatch) {
                hData.on[eventMatch[1]] = getObject(data, value);
            }
            else if (name != 'id' && name != 'class') {
                hData.attrs[parseName(name)] = value;
            }
        }(attributes[i].name, attributes[i].value));
    }

    for(i = 0, length = dom.childNodes.length; i < length; i++){
        let child = dom.childNodes[i];
        if (child.nodeType == Node.TEXT_NODE) {
            children.push(child.textContent);
        }
        else {
            children.push(parseDOM(child, data, h));
        }
    }

    return h(selector, hData, children);
}

function parseName (name) {
    return name.replace(/-([a-z])/ig, function ($0, $1) {
        return $1.toUpperCase();
    });
}

function parseProp(prop) {
    let propList = [];
    if (prop.charAt(0) != '[') {
        propList = prop.split('.');
    }
    else {
        propList = prop.replace(/^\[[\'\"]?|[\'\"]?$/g, '').split(/[\'\"]?\]\[[\'\"]?/); // ['a'][0]
    }

    return propList;
}

function getObject (object, prop, defaultValue) {
    let propList = parseProp(prop);

    for(let i = 0, length = propList.length; i < length; i++) {
        if (propList[i] in object) {
            object = object[propList[i]];
        }
        else {
            return defaultValue;
        }
    }
    return object;
}

function setObject (object, prop, value) {
    let propList = parseProp(prop);

    for(let i = 0, length = propList.length; i < length; i++) {
        if (i == length-1) {
            object[propList[i]] = value;
        }
        else {
            object = object[propList[i]];
        }
    }
}

module.exports = function (html, data, h) {
    let dom = parseFromString(html);
    return parseDOM(dom, data, h);
};
