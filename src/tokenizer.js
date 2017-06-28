var STATE_TEXT = 0,
    STATE_OPEN_TAG_START = 1, // <
    STATE_TAG_NAME = 2,
    STATE_TAG_BLANK = 3;

STATE_CODE_SINGLE_QUTO;
STATE_CODE_SINGLE_QUTO_ESCAPE;
STATE_CODE_SINGLE_QUTO

var state = STATE_TEXT;
var code = "var html='";
var buffer = '';
var index = 0;

function transfer () {
    const char = text.charAt(index++);

    switch (state) {
        case STATE_TEXT:
            if (char == '<') {
                state = STATE_OPEN_TAG_START;
                buffer += char;
            }
            else {
                buffer += char;
            }
            break;

        case STATE_OPEN_TAG_START:
            if (char == %) {
                state = STATE_CODE;
                code += "';" + char;
            }
            else {
                state = STATE_TEXT;
                code += '<' + char;
            }
            break;

        case STATE_TAG_NAME:
            if (/\s/.test(char)) {
                state = STATE_TAG_BLANK;
                code += char;
            }
            else {
                code += char;
            }
            break;

        case STATE_TAG_BLANK:
            if (/[a-z]/i.test(char)) {

            }

        case STATE_CODE:
            if ("'" == char) {
                state = STATE_CODE_SINGLE_QUTO;
                code += char;
            }
            else if ('"' == char) {
                state = STATE_CODE_DOUBLE_QUTO;
                code += char;
            }
            else if ('%' == char && '>' == text.charAt(index+1)) {
                state = STATE_TEXT;
                index += 2;
            }

        // 代码中的单引号
        case STATE_CODE_SINGLE_QUTO:
            if ("\\" == char) {
                code += "\\" + text.charAt(index++);
            }
            else if ("'" == char) {
                state = STATE_CODE;
                code += char;
            }
            else {
                code += char;
            }

         //
        case STATE_CODE_DOUBLE_QUTO:
            if ("\\" == char) {
                code += "\\" + text.charAt(index++);
            }
            else if ('"' == char) {
                state = STATE_CODE;
                code += char;
            }
            else {
                code += char;
            }

        default:
            code += char;
    }
}

function parse (text) {
    const length = text.length;
    while (index < length) {
        transfer();
    }
}

module.exports = parse;
