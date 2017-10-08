/************
 * Template *
 ************/

const Compiler = require('./compiler');

class Template {

    constructor(text) {
        let compiler = new Compiler(text);
        this.code = compiler.getCode();
    }

    render(data) {
        let evalCode = function () { return '' };
        let code = `evalCode=function(${Object.keys(data).join(',')}){${this.code}}`;
        try {
            eval(code);
        }
        catch (e) {}
        return evalCode.apply(this, Object.values(data));
    }

}

module.exports = Template;