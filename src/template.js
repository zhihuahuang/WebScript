'use strict';

function template(text) {
    // var varName = 'html_' + Date.now();
    var varName = 'html';

    var code = text
        .replace(/\s*(\r)?\n\s*/g, "")
        .replace(/'/g, "\\'")
        .replace(/<\s+/g, "';")
        .replace(/\s+>/g, varName + "+='")
        .replace(/\${([^}]*)}/g, function () {
            return "'+(" + arguments[1].trim() + ")+'";
        });

    code = "var "+varName+"='" + code + "';return " + varName + ";";

    code = code.replace(/\\'/g, "'");

    return code;
}

module.exports = template;