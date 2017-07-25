var domParser = new DOMParser();

function parseFromString(string) {
    var doc = domParser.parseFromString(string, 'text/html');
    return doc.body.firstChild;
}

function parseDOM (dom, data, h) {
    var tagName = dom.tagName,
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
    var attributes = dom.attributes;

    var i,
        length;

    for(i = 0, length = attributes.length; i < length; i++) {
        (function (name, value) {
            var eventMatch = /^on(.*)/.exec(name);
            var bindMatch = /^:(.*)/.exec(value);
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
            else if (bindMatch && eventMatch) {
                hData.on[eventMatch[1]] = getObject(data, bindMatch[1]);
            }
            else if (name != 'id' && name != 'class') {
                hData.attrs[parseName(name)] = value;
            }
        }(attributes[i].name, attributes[i].value));
    }

    for(i = 0, length = dom.childNodes.length; i < length; i++){
        var child = dom.childNodes[i];
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
    var propList = [];
    if (prop.charAt(0) != '[') {
        propList = prop.split('.');
    }
    else {
        propList = prop.replace(/^\[[\'\"]?|[\'\"]?$/g, '').split(/[\'\"]?\]\[[\'\"]?/); // ['a'][0]
    }

    return propList;
}

function getObject (object, prop, defaultValue) {
    var propList = parseProp(prop);

    for(var i = 0, length = propList.length; i < length; i++) {
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
    var propList = parseProp(prop);

    for(var i = 0, length = propList.length; i < length; i++) {
        if (i == length-1) {
            object[propList[i]] = value;
        }
        else {
            object = object[propList[i]];
        }
    }
}

module.exports = function (html, data, h) {
    var dom = parseFromString(html);
    return parseDOM(dom, data, h);
};
