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
    var attributeList = [];
    for(var i = 0, length = attributes.length; i < length; i++) {
        var name = attributes[i].name;
        var value = attributes[i].value;
        // 如果是 <input>，并且 value 属性的值是 : 开头的合法变量名，则绑定函数
        if (name == 'value' && /^:[$[a-z]/i.test(value.trim()) && tagName == 'INPUT') {
            var match = /^:([^\s]+)/.exec(value.trim());
            var bindName = "data" + (/^\[/.test(match[1]) ?  "" : ".") + match[1];
            attributeList.push("on:{input:function(event){" +
                                    "var self = this;" +
                                    bindName + "=event.target.value;" +
                                    "observer.attach(function(){" +
                                        "event.target.value=" + bindName +
                                    "})" +
                                "}}");
        }
        else if (name != 'id' && name != 'class') {
            attributeList.push('"' + name + '":' + JSON.stringify(value));
        }
    }

    output += "',{" + attributeList.join(",") + "}";

    // 解析子元素
    output += ',[';
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

module.exports = function (html) {
    return parseDOM(parseFromString(html));
};
