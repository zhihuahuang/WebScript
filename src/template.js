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
        let fn = () => '';
        let code = `fn=function(${Object.keys(data).join(',')}){${this.code}}`;
        eval(code);
        return fn.apply(this, Object.values(data));
    }

}

module.exports = Template;