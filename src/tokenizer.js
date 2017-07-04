var LT = "<";
var GT = ">";
var SINGLE_QUTO = "'";
var DOUBLE_QUTO = '"';
var TPL_QUTO = "`";
var ESCAPE_CHAR = "\\";

var STATE_HTML = 0;

var STATE_CODE = 1;
var STATE_CODE_SINGLE_QUTO = 2;
var STATE_CODE_DOUBLE_QUTO = 3;

var STATE_OUTPUT = 4;
var STATE_OUTPUT_SINGLE_QUTO = 5;
var STATE_OUTPUT_DOUBLE_QUTO = 6;

var STATE_SCRIPT_TAG = 7;
var STATE_SCRIPT_SINGLE_QUTO = 8;
var STATE_SCRIPT_DOUBLE_QUTO = 9;
var STATE_SCRIPT_TPL_QUTO = 10;
var STATE_SCRIPT_CODE = 11;

var text = '';
var state = STATE_HTML;
var code;
var index = 0;

function transfer () {
     var char = text.charAt(index);

    switch (state) {
        case STATE_HTML:
            if (LT == char && '%' == text.charAt(index+1)) {
                state = STATE_CODE;
                code += "';";
                index++;
            }
            else if ('<' == char &&
                     's' == text.charAt(index+1) &&
                     'c' == text.charAt(index+2) &&
                     'r' == text.charAt(index+3) &&
                     'i' == text.charAt(index+4) &&
                     'p' == text.charAt(index+5) &&
                     't' == text.charAt(index+6) &&
                     /[>\s]/.test(text.charAt(index+7))) {
                state = STATE_SCRIPT_TAG;
                code += "<script";
                index += 6;
            }
            else if ('$' == char && '{' == text.charAt(index+1)) {
                state = STATE_OUTPUT;
                code += "'+(";
                index++;
            }
            else if ("\r" == char) {
                code += "\\r";
            }
            else if ("\n" == char) {
                code += "\\n";
            }
            else {
                code += char;
            }
            break;

        case STATE_CODE:
            if (SINGLE_QUTO == char) {
                state = STATE_CODE_SINGLE_QUTO;
                code += char;
            }
            else if (DOUBLE_QUTO == char) {
                state = STATE_CODE_DOUBLE_QUTO;
                code += char;
            }
            else if ('%' == char && '>' == text.charAt(index+1)) {
                state = STATE_HTML;
                code += ";html+='";
                index++;
            }
            else {
                code += char;
            }
            break;

        // 代码中的单引号
        case STATE_CODE_SINGLE_QUTO:
            if (ESCAPE_CHAR == char) {
                code += char + text.charAt(++index);
            }
            else if (SINGLE_QUTO == char) {
                state = STATE_CODE;
                code += char;
            }
            else {
                code += char;
            }
            break;

         // 代码中的双引号
        case STATE_CODE_DOUBLE_QUTO:
            if (ESCAPE_CHAR == char) {
                code += char + text.charAt(++index);
            }
            else if (DOUBLE_QUTO == char) {
                state = STATE_CODE;
                code += char;
            }
            else {
                code += char;
            }
            break;

        case STATE_OUTPUT:
            if (SINGLE_QUTO == char) {
                state = STATE_OUTPUT_SINGLE_QUTO;
                code += char;
            }
            else if (DOUBLE_QUTO == char) {
                state = STATE_OUTPUT_DOUBLE_QUTO;
                code += char;
            }
            else if ('}' == char) {
                state = STATE_HTML;
                code += ")+'";
            }
            else {
                code += char;
            }
            break;

        // 代码中的单引号
        case STATE_OUTPUT_SINGLE_QUTO:
        case STATE_SCRIPT_SINGLE_QUTO:
            if (ESCAPE_CHAR == char) {
                code += char + text.charAt(++index);
            }
            else if (SINGLE_QUTO == char) {
                state = STATE_OUTPUT;
                code += char;
            }
            else {
                code += char;
            }
            break;

        // 代码中的双引号
        case STATE_OUTPUT_DOUBLE_QUTO:
            if (ESCAPE_CHAR == char) {
                code += char + text.charAt(++index);
            }
            else if (DOUBLE_QUTO == char) {
                state = STATE_OUTPUT;
                code += char;
            }
            else {
                code += char;
            }
            break;

        // Script 代码
        case STATE_SCRIPT_TAG:
            if (SINGLE_QUTO == char) {
                state = STATE_SCRIPT_SINGLE_QUTO;
                code += char;
            }
            else if (DOUBLE_QUTO == char) {
                state = STATE_SCRIPT_DOUBLE_QUTO;
                code += char;
            }
            else if ('>' == char) {
                state = STATE_SCRIPT_CODE;
                code += char;
            }
            else {
                code += char;
            }
            break;

        case STATE_SCRIPT_CODE:
            if ('<' == char &&
                '/' == text.charAt(index+1) &&
                's' == text.charAt(index+2) &&
                'c' == text.charAt(index+3) &&
                'r' == text.charAt(index+4) &&
                'i' == text.charAt(index+5) &&
                'p' == text.charAt(index+6) &&
                't' == text.charAt(index+7) &&
                '>' == text.charAt(index+8)) {
                state = STATE_HTML;
                code += '</script>';
                index += 8;
            }
            else {
                code += char;
            }
            break;

        case STATE_SCRIPT_SINGLE_QUTO:
            if (ESCAPE_CHAR == char) {
                code += char + text.charAt(++index);
            }
            else if (SINGLE_QUTO == char) {
                state = STATE_SCRIPT_CODE;
                code += char;
            }
            else {
                code += char;
            }
            break;

        case STATE_SCRIPT_DOUBLE_QUTO:
            if (ESCAPE_CHAR == char) {
                code += char + text.charAt(++index);
            }
            else if (DOUBLE_QUTO == char) {
                state = STATE_SCRIPT_CODE;
                code += char;
            }
            else {
                code += char;
            }
            break;
    }

    index++;
}

function parse (txt) {
    code = "var html='";
    text = txt;
     var length = text.length;
    while (index < length) {
        transfer();
    }
    code += "';return html;";
    return code;
}

module.exports = parse;
