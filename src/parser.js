var domParser = new DOMParser();

function parseFromString(string) {
    var doc = domParser.parseFromString(string, 'text/html');
    return doc.body.firstChild;
}

function parseDOM(element) {
    var tagName = element.tagName;

    var output = "h('" + tagName;

    if (element.id) {
        output += '#' + element.id;
    }
    if (element.className) {
        output += '.' + element.className.trim().replace(/\s+/, '.');
    }

    // 解析属性
    var attributes = element.attributes;

    var hData = {
        attrsList: [],
        propsList: [],
        onList: []
    };

    for(var i = 0, length = attributes.length; i < length; i++) {
        var name = attributes[i].name;
        var value = attributes[i].value;

        // Var Bind
        if (name == "name" && isBindVar(value) && (tagName == "INPUT" || tagName == "TEXTAREA" || tagName == "SELECT")) {
            var bindVarName = getBindVar(value);
            if (element.type == 'radio') {
                hData.propsList.push(buildKeyValue("checked", parseValue(element.value) + "==" + bindVarName));

                hData.onList.push(buildKeyValue("change", "function(event){" + bindVarName + "=event.target.value}"))
            }
            else if (element.type == 'checkbox') {
                hData.propsList.push(buildKeyValue("checked", bindVarName));

                hData.onList.push(buildKeyValue("change", "function(event){" + bindVarName + "=event.target.checked}"))
            }
            else {
                hData.propsList.push(buildKeyValue("value", bindVarName));

                hData.onList.push(buildKeyValue("input", "function(event){" + bindVarName + "=event.target.value}"));
            }
        }
        // On Event
        else if (/^on/i.test(name) && isBindVar(value)) {
            var bindVarName = getBindVar(value);
            hData.onList.push(buildKeyValue(name.slice(2), bindVarName));
        }
        else if (name != 'id' && name != 'class') {
            hData.attrsList.push(parseAttrName(name)+ ':' + parseAttrValue(value));
        }
    }

    output += "',{";

    for(var name in hData) {
        if (hData[name].length > 0) {
            output += name.slice(0,-4) + ":{" + hData[name].join(",") + "},";
        }
    }

    // 解析子元素
    output += '},[';
    for(var i = 0, length = element.childNodes.length; i < length; i++){
        var child = element.childNodes[i];
        if (child.nodeType == Node.TEXT_NODE) {
            output += JSON.stringify(child.textContent) + ",";
        }
        else {
            output += parseDOM(child) + ",";
        }
    }
    output += "])";

    return output;
}

function isBindVar (value) {
    return /^:[$[a-z]/i.test(value.trim());
}

function getBindVar (value) {
    var match = /^:([^\s]+)/.exec(value.trim());
    return "data" + (/^\[/.test(match[1]) ?  "" : ".") + match[1];
}

function parseAttrName (name) {
    return '"' + name + '"';
}

function parseAttrValue (value) {
    return JSON.stringify(value);
}

function buildKeyValue (key, value) {
    return key + ":" + value;
}

function parseValue (value) {
    return JSON.stringify(value);
}

module.exports = function (html) {
    return parseDOM(parseFromString(html));
};
