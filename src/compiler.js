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

module.exports = Compiler;

/**
 *
 * @param text
 * @returns {{getCode: string}}
 * @constructor
 */
function Compiler (text) {
    var _var = '_html' + Date.now();
    var state = STATE_HTML;
    var codeList = [`var ${_var}='`];
    var index = 0;
    var length = text.length;

    while (index < length) {
        transfer();
    }
    pushCode(`';return ${_var};`);

    return {
        getCode: getCode
    };

    /**
     *
     * @returns {string}
     */
    function getCode () {
        return codeList.join('');
    }

    function pushCode (string) {
        codeList.push(string);
    }

    function charAt (string, index) {
        return string.charAt(index);
    }

    function toLowerCase (string) {
        return string.toLowerCase();
    }

    /**
     *
     */
    function transfer () {
        var char = charAt(text, index);

        switch (state) {
            case STATE_HTML:
                if (CHAR_LT == char && '%' == charAt(text, index+1)) {
                    state = STATE_CODE;
                    pushCode("';");
                    index++;
                }
                else if ('<' == char &&
                    's' == toLowerCase(charAt(text, index+1)) &&
                    'c' == toLowerCase(charAt(text, index+2)) &&
                    'r' == toLowerCase(charAt(text, index+3)) &&
                    'i' == toLowerCase(charAt(text, index+4)) &&
                    'p' == toLowerCase(charAt(text, index+5)) &&
                    't' == toLowerCase(charAt(text, index+6)) &&
                    /[>\s]/.test(charAt(text, index+7))) {
                    state = STATE_SCRIPT_TAG;
                    pushCode("<script");
                    index += 6;
                }
                else if ('$' == char && '{' == charAt(text, index+1)) {
                    state = STATE_OUTPUT;
                    pushCode("'+(");
                    index++;
                }
                else if ("\r" == char) {
                    pushCode("\\r");
                }
                else if ("\n" == char) {
                    pushCode("\\n");
                }
                else {
                    pushCode(char);
                }
                break;

            case STATE_CODE:
                if (CHAR_SINGLE_QUTO == char) {
                    state = STATE_CODE_SINGLE_QUTO;
                    pushCode(char);
                }
                else if (CHAR_DOUBLE_QUTO == char) {
                    state = STATE_CODE_DOUBLE_QUTO;
                    pushCode(char);
                }
                else if ('%' == char && CHAR_GT == charAt(text, index+1)) {
                    state = STATE_HTML;
                    pushCode(`;${_var}+='`);
                    index++;
                }
                else {
                    pushCode(char);
                }
                break;

            // 代码中的单引号
            case STATE_CODE_SINGLE_QUTO:
                if (CHAR_ESCAPE == char) {
                    pushCode(char);
                    pushCode(charAt(text, ++index));
                }
                else if (CHAR_SINGLE_QUTO == char) {
                    state = STATE_CODE;
                    pushCode(char);
                }
                else {
                    pushCode(char);
                }
                break;

            // 代码中的双引号
            case STATE_CODE_DOUBLE_QUTO:
                if (CHAR_ESCAPE == char) {
                    pushCode(char);
                    pushCode(charAt(text, ++index));
                }
                else if (CHAR_DOUBLE_QUTO == char) {
                    state = STATE_CODE;
                    pushCode(char);
                }
                else {
                    pushCode(char);
                }
                break;

            case STATE_OUTPUT:
                if (CHAR_SINGLE_QUTO == char) {
                    state = STATE_OUTPUT_SINGLE_QUTO;
                    pushCode(char);
                }
                else if (CHAR_DOUBLE_QUTO == char) {
                    state = STATE_OUTPUT_DOUBLE_QUTO;
                    pushCode(char);
                }
                else if ('}' == char) {
                    state = STATE_HTML;
                    pushCode(")+'");
                }
                else {
                    pushCode(char);
                }
                break;

            // 代码中的单引号
            case STATE_OUTPUT_SINGLE_QUTO:
                if (CHAR_ESCAPE == char) {
                    pushCode(char);
                    pushCode(charAt(text, ++index));
                }
                else if (CHAR_SINGLE_QUTO == char) {
                    state = STATE_OUTPUT;
                    pushCode(char);
                }
                else {
                    pushCode(char);
                }
                break;

            // 代码中的双引号
            case STATE_OUTPUT_DOUBLE_QUTO:
                if (CHAR_ESCAPE == char) {
                    pushCode(char);
                    pushCode(charAt(text, ++index));
                }
                else if (CHAR_DOUBLE_QUTO == char) {
                    state = STATE_OUTPUT;
                    pushCode(char);
                }
                else {
                    pushCode(char);
                }
                break;

            // Script 代码
            case STATE_SCRIPT_TAG:
                if (CHAR_SINGLE_QUTO == char) {
                    state = STATE_SCRIPT_SINGLE_QUTO;
                    pushCode(char);
                }
                else if (CHAR_DOUBLE_QUTO == char) {
                    state = STATE_SCRIPT_DOUBLE_QUTO;
                    pushCode(char);
                }
                else if (CHAR_GT == char) {
                    state = STATE_SCRIPT_CODE;
                    pushCode(char);
                }
                else {
                    pushCode(char);
                }
                break;

            case STATE_SCRIPT_CODE:
                if ('<' == char &&
                    '/' == charAt(text, index+1) &&
                    's' == toLowerCase(charAt(text, index+2)) &&
                    'c' == toLowerCase(charAt(text, index+3)) &&
                    'r' == toLowerCase(charAt(text, index+4)) &&
                    'i' == toLowerCase(charAt(text, index+5)) &&
                    'p' == toLowerCase(charAt(text, index+6)) &&
                    't' == toLowerCase(charAt(text, index+7)) &&
                    '>' == charAt(text, index+8) ) {
                    state = STATE_HTML;
                    pushCode('</script>');
                    index += 8;
                }
                else {
                    pushCode(char);
                }
                break;

            case STATE_SCRIPT_SINGLE_QUTO:
                if (CHAR_ESCAPE == char) {
                    pushCode(char);
                    pushCode(charAt(text, ++index));
                }
                else if (CHAR_SINGLE_QUTO == char) {
                    state = STATE_SCRIPT_CODE;
                    pushCode(char);
                }
                else {
                    pushCode(char);
                }
                break;

            case STATE_SCRIPT_DOUBLE_QUTO:
                if (CHAR_ESCAPE == char) {
                    pushCode(char);
                    pushCode(charAt(text, ++index));
                }
                else if (CHAR_DOUBLE_QUTO == char) {
                    state = STATE_SCRIPT_CODE;
                    pushCode(char);
                }
                else {
                    pushCode(char);
                }
                break;
        }

        index++;
    }
}

