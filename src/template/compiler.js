/************
 * Compiler *
 ************/
const _private = require('./../utils/private');

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

        let _this = _private(this);

        _this.text = text;
        _this.state = STATE_HTML;
        _this.index = 0;
        _this.codeArray = [ `var ${VAR_NAME}='` ];
        _this.code = `;${VAR_NAME}+='`;

        while (_this.index < _this.text.length) {
            transfer(_this);
        }

        _this.codeArray.push(`';return ${VAR_NAME};`);
    }

    getCode() {
        return _private(this).codeArray.join('');
    }
}

/**
 * @private
 *
 * @param _this
 * @param offset
 *
 * @returns {*}
 */
function getChar (_this, offset = 0) {
    return _this.text.at(_this.index + offset);
}

/**
 * @private
 *
 * @param _this
 * @param code
 */
function transfer (_this) {
    const char = getChar(_this);

    let state = _this.state,
        appendCode = char,
        step = 1;

    switch (state) {
        case STATE_HTML:
            if (equal(CHAR_LT, char) &&
                equal('%', getChar(_this, 1))) {
                state = STATE_CODE;
                appendCode = "';";
                step++;
            }
            else if ('<' === char &&
                equal('s', toLowerCase(getChar(_this, 1))) &&
                equal('c', toLowerCase(getChar(_this, 2))) &&
                equal('r', toLowerCase(getChar(_this, 3))) &&
                equal('i', toLowerCase(getChar(_this, 4))) &&
                equal('p', toLowerCase(getChar(_this, 5))) &&
                equal('t', toLowerCase(getChar(_this, 6))) &&
                /[>\s]/.test(getChar(_this, 7))) {
                state = STATE_SCRIPT_TAG;
                appendCode = "<script";
                step += 6;
            }
            else if (equal('$', char) &&
                     equal('{', getChar(_this, 1))) {
                state = STATE_OUTPUT;
                appendCode = "'+(";
                step++;
            }
            else if (equal("\r", char)) {
                appendCode = "\\r";
            }
            else if (equal("\n", char)) {
                appendCode = "\\n";
            }
            break;

        case STATE_CODE:
            if (equal(CHAR_SINGLE_QUTO, char)) {
                state = STATE_CODE_SINGLE_QUTO;
            }
            else if (equal(CHAR_DOUBLE_QUTO, char)) {
                state = STATE_CODE_DOUBLE_QUTO;
            }
            else if (equal('%', char) &&
                     equal(CHAR_GT, getChar(_this, 1))) {
                state = STATE_HTML;
                step++;
                appendCode = _this.code;
            }
            break;

        // 代码中的单引号
        case STATE_CODE_SINGLE_QUTO:
            if (equal(CHAR_ESCAPE, char)) {
                appendCode += getChar(_this, 1);
                step++;
            }
            else if (equal(CHAR_SINGLE_QUTO, char)) {
                state = STATE_CODE;
            }
            break;

        // 代码中的双引号
        case STATE_CODE_DOUBLE_QUTO:
            if (equal(CHAR_ESCAPE, char)) {
                appendCode += getChar(_this, 1);
                step++;
            }
            else if (equal(CHAR_DOUBLE_QUTO, char)) {
                state = STATE_CODE;
            }
            break;

        case STATE_OUTPUT:
            if (equal(CHAR_SINGLE_QUTO, char)) {
                state = STATE_OUTPUT_SINGLE_QUTO;
            }
            else if (equal(CHAR_DOUBLE_QUTO, char)) {
                state = STATE_OUTPUT_DOUBLE_QUTO;
            }
            else if (equal('}', char)) {
                state = STATE_HTML;
                appendCode = ")+'";
            }
            break;

        // 代码中的单引号
        case STATE_OUTPUT_SINGLE_QUTO:
            if (equal(CHAR_ESCAPE, char)) {
                appendCode += getChar(_this, 1);
                step++;
            }
            else if (equal(CHAR_SINGLE_QUTO, char)) {
                state = STATE_OUTPUT;
            }
            break;

        // 代码中的双引号
        case STATE_OUTPUT_DOUBLE_QUTO:
            if (equal(CHAR_ESCAPE, char)) {
                appendCode += getChar(_this, 1);
                step++;
            }
            else if (equal(CHAR_DOUBLE_QUTO, char)) {
                state = STATE_OUTPUT;
            }
            break;

        // Script 代码
        case STATE_SCRIPT_TAG:
            if (CHAR_SINGLE_QUTO === char) {
                state = STATE_SCRIPT_SINGLE_QUTO;
            }
            else if (CHAR_DOUBLE_QUTO === char) {
                state = STATE_SCRIPT_DOUBLE_QUTO;
            }
            else if (CHAR_GT === char) {
                state = STATE_SCRIPT_CODE;
            }
            break;

        case STATE_SCRIPT_CODE:
            if (equal('<', char) &&
                equal('/', getChar(_this, 1)) &&
                equal('s', toLowerCase(getChar(_this, 2))) &&
                equal('c', toLowerCase(getChar(_this, 3))) &&
                equal('r', toLowerCase(getChar(_this, 4))) &&
                equal('i', toLowerCase(getChar(_this, 5))) &&
                equal('p', toLowerCase(getChar(_this, 6))) &&
                equal('t', toLowerCase(getChar(_this, 7))) &&
                equal('>', getChar(_this, 8))) {
                state = STATE_HTML;
                appendCode = '</script>';
                step += 8;
            }
            break;

        case STATE_SCRIPT_SINGLE_QUTO:
            if (equal(CHAR_ESCAPE, char)) {
                appendCode += getChar(_this, 1);
                step++
            }
            else if (equal(CHAR_SINGLE_QUTO, char)) {
                state = STATE_SCRIPT_CODE;
            }
            break;

        case STATE_SCRIPT_DOUBLE_QUTO:
            if (equal(CHAR_ESCAPE, char)) {
                appendCode += getChar(_this, 1);
                step++;
            }
            else if (equal(CHAR_DOUBLE_QUTO, char)) {
                state = STATE_SCRIPT_CODE;
            }
            break;
    }

    _this.state = state;
    _this.index += step;
    _this.codeArray.push(appendCode);
}

module.exports = Compiler;

function toLowerCase (string) {
    return string.toLowerCase();
}

function equal (left, right) {
    return left === right;
}