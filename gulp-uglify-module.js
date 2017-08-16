const through2 = require('through2');

/**
 * 混淆 require 中的字符串
 * @returns {*}
 */
module.exports = uglifyModule;

function uglifyModule () {
    return through2.obj(function (file, encoding, callback) {
        let moduleNameMap = {};

        let content = file.contents.toString();

        let pattern = /require\(['"](.*?)['"]\)/g;
        let match;
        let i = 0;

        while (match = pattern.exec(content)) {
            let moduleName = match[1];
            if (!(moduleName in moduleNameMap)) {
                moduleNameMap[moduleName] = getUglifyName(i++);
            }
        }

        for (let moduleName in moduleNameMap) {
            let name = moduleName.replace(/[.$]/g, function ($0) {
                return '\\'+$0;
            });


            let moduleRegexp = new RegExp('[\'"]' + name + '[\'"]' , 'gim');

            content = content.replace(moduleRegexp, `'${moduleNameMap[moduleName]}'`);
        }

        file.contents = new Buffer(content);

        callback(null, file);
    });
}

function getUglifyName(int) {
    var name = '';
    int = int;
    while(int > 0) {
        var mod = int % 26;
        name = String.fromCharCode(97 + mod) + name;
        int = Math.floor(int/26);
    }
    return name;
}