var Parser = require("htmlparser2/lib/Parser");

var code = '';
var stack = [];

var parser = new Parser({
    onopentag: function(tagname, attribs){
        var element = {
            tagName: tagname,
            id: "",
            classList: [],
            attributes: {},
            innerText: ""
        };

        for(var name in attribs) {
            var value = attribs[name];
            switch (name) {
                case 'id':
                    element.id = value;
                    break;

                case 'class':
                    var className = value.trim();
                    if (className) {
                        element.classList = className.split(/\s+/);
                    }
                    break;

                default:
                    element.attributes[name] = value;
            }
        }

        stack.push(element);
    },
    ontext: function(text){
        var element = stack.pop();
        element.innerText = text;
        stack.push(element);
    },
    onclosetag: function(tagname) {
        var element = stack.pop();

        // 构造选择器参数
        var selector = element.tagName;
        if (element.id) {
            selector += '#' + element.id;
        }
        if (element.classList.length > 0) {
            selector += '.' + element.classList.join('.');
        }

        // 构造属性列表
        var attrList = [];
        for(var name in element.attributes) {
            attrList.push(name + ":'" + element.attributes[name] + "'");
        }

        code += "h('" + selector + "'" +
                (attrList.length > 0 ? ",{" + attrList.join(',') + "}" : "") +
                (element.innerText ? ",'" + element.innerText + "'" : "") + ")";
    }
}, {decodeEntities: true});


function stringify(value) {
    return '' + value;
}

module.exports = function(html) {
    code = '';
    parser.write(html);
    parser.end();
    return code;
};