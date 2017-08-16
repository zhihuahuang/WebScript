/************
 * Compiler *
 ************/

require('core-js/fn/string/at');

const CHAR_LT = "<";
const CHAR_GT = ">";
const CHAR_SINGLE_QUTO = "'";
const CHAR_DOUBLE_QUTO = '"';
const CHAR_ESCAPE = "\\";

const STATE_HTML = 0;

const STATE_CODE = 1;
const STATE_CODE_SINGLE_QUTO = 2;
const STATE_CODE_DOUBLE_QUTO = 3;

const STATE_OUTPUT = 4;
const STATE_OUTPUT_SINGLE_QUTO = 5;
const STATE_OUTPUT_DOUBLE_QUTO = 6;

const STATE_SCRIPT_TAG = 7;
const STATE_SCRIPT_SINGLE_QUTO = 8;
const STATE_SCRIPT_DOUBLE_QUTO = 9;
const STATE_SCRIPT_CODE = 10;

class Compiler {

    constructor(text) {
        const VAR_NAME = `_html_${Date.now()}`;

        let self = this;

        self.text = text;
        self.state = STATE_HTML;
        self.index = 0;
        self.codeArray = [ `var ${VAR_NAME}='` ];

        while (self.index < self.text.length) {
            self.transfer(`;${VAR_NAME}+='`);
        }

        self.append(`';return ${VAR_NAME};`);
    }

    getChar(offset = 0) {
        return this.text.at(this.index + offset);
    }

    getCode() {
        return this.codeArray.join('');
    }

    append(code) {
        this.codeArray.push(code);
    }

    transfer(code) {
        let self = this;
        let char = self.getChar();

        switch (self.state) {
            case STATE_HTML:
                if (CHAR_LT === char && '%' === self.getChar(1)) {
                    self.state = STATE_CODE;
                    self.append("';");
                    self.index++;
                }
                else if ('<' === char &&
                    's' === toLowerCase(self.getChar(1)) &&
                    'c' === toLowerCase(self.getChar(2)) &&
                    'r' === toLowerCase(self.getChar(3)) &&
                    'i' === toLowerCase(self.getChar(4)) &&
                    'p' === toLowerCase(self.getChar(5)) &&
                    't' === toLowerCase(self.getChar(6)) &&
                    /[>\s]/.test(self.getChar(7))) {
                    self.state = STATE_SCRIPT_TAG;
                    self.append("<script");
                    self.index += 6;
                }
                else if ('$' === char && '{' === self.getChar(1)) {
                    self.state = STATE_OUTPUT;
                    self.append("'+(");
                    self.index++;
                }
                else if ("\r" === char) {
                    self.append("\\r");
                }
                else if ("\n" === char) {
                    self.append("\\n");
                }
                else {
                    self.append(char);
                }
                break;

            case STATE_CODE:
                if (CHAR_SINGLE_QUTO === char) {
                    self.state = STATE_CODE_SINGLE_QUTO;
                    self.append(char);
                }
                else if (CHAR_DOUBLE_QUTO === char) {
                    self.state = STATE_CODE_DOUBLE_QUTO;
                    self.append(char);
                }
                else if ('%' === char && CHAR_GT === self.getChar(1)) {
                    self.state = STATE_HTML;
                    self.append(code);
                    self.index++;
                }
                else {
                    self.append(char);
                }
                break;

            // 代码中的单引号
            case STATE_CODE_SINGLE_QUTO:
                if (CHAR_ESCAPE === char) {
                    self.append(char + self.getChar(1));
                    self.index++;
                }
                else if (CHAR_SINGLE_QUTO === char) {
                    self.state = STATE_CODE;
                    self.append(char);
                }
                else {
                    self.append(char);
                }
                break;

            // 代码中的双引号
            case STATE_CODE_DOUBLE_QUTO:
                if (CHAR_ESCAPE === char) {
                    self.append(char + self.getChar(1));
                    self.index++;
                }
                else if (CHAR_DOUBLE_QUTO === char) {
                    self.state = STATE_CODE;
                    self.append(char);
                }
                else {
                    self.append(char);
                }
                break;

            case STATE_OUTPUT:
                if (CHAR_SINGLE_QUTO === char) {
                    self.state = STATE_OUTPUT_SINGLE_QUTO;
                    self.append(char);
                }
                else if (CHAR_DOUBLE_QUTO === char) {
                    self.state = STATE_OUTPUT_DOUBLE_QUTO;
                    self.append(char);
                }
                else if ('}' === char) {
                    self.state = STATE_HTML;
                    self.append(")+'");
                }
                else {
                    self.append(char);
                }
                break;

            // 代码中的单引号
            case STATE_OUTPUT_SINGLE_QUTO:
                if (CHAR_ESCAPE === char) {
                    self.append(char + charAt(self.text, ++self.index));
                }
                else if (CHAR_SINGLE_QUTO === char) {
                    self.state = STATE_OUTPUT;
                    self.append(char);
                }
                else {
                    self.append(char);
                }
                break;

            // 代码中的双引号
            case STATE_OUTPUT_DOUBLE_QUTO:
                if (CHAR_ESCAPE === char) {
                    self.append(char + self.getChar(1));
                    self.index++;
                }
                else if (CHAR_DOUBLE_QUTO === char) {
                    self.state = STATE_OUTPUT;
                    self.append(char);
                }
                else {
                    self.append(char);
                }
                break;

            // Script 代码
            case STATE_SCRIPT_TAG:
                if (CHAR_SINGLE_QUTO === char) {
                    self.state = STATE_SCRIPT_SINGLE_QUTO;
                    self.append(char);
                }
                else if (CHAR_DOUBLE_QUTO === char) {
                    self.state = STATE_SCRIPT_DOUBLE_QUTO;
                    self.append(char);
                }
                else if (CHAR_GT === char) {
                    self.state = STATE_SCRIPT_CODE;
                    self.append(char);
                }
                else {
                    self.append(char);
                }
                break;

            case STATE_SCRIPT_CODE:
                if ('<' === char &&
                    '/' === self.getChar(1) &&
                    's' === toLowerCase(self.getChar(2)) &&
                    'c' === toLowerCase(self.getChar(3)) &&
                    'r' === toLowerCase(self.getChar(4)) &&
                    'i' === toLowerCase(self.getChar(5)) &&
                    'p' === toLowerCase(self.getChar(6)) &&
                    't' === toLowerCase(self.getChar(7)) &&
                    '>' === self.getChar(8) ) {
                    self.state = STATE_HTML;
                    self.append('</script>');
                    self.index += 8;
                }
                else {
                    self.append(char);
                }
                break;

            case STATE_SCRIPT_SINGLE_QUTO:
                if (CHAR_ESCAPE === char) {
                    self.append(char + self.getChar(1));
                    self.index++
                }
                else if (CHAR_SINGLE_QUTO === char) {
                    self.state = STATE_SCRIPT_CODE;
                    self.append(char);
                }
                else {
                    self.append(char);
                }
                break;

            case STATE_SCRIPT_DOUBLE_QUTO:
                if (CHAR_ESCAPE === char) {
                    self.append(char + self.getChar(1));
                    self.index++;
                }
                else if (CHAR_DOUBLE_QUTO === char) {
                    self.state = STATE_SCRIPT_CODE;
                    self.append(char);
                }
                else {
                    self.append(char);
                }
                break;
        }

        self.index++;
    }
}

module.exports = Compiler;

function toLowerCase (string) {
    return string.toLowerCase();
}