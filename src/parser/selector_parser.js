const STATE_TAG = 0;
const STATE_ID = 1;
const STATE_CLASS = 2;

const IDENTIFIERS = /[a-z0-9-_]/i;

tagnameArray = [];
idArray = [];
classListArray = [[]];

switch (state) {
    case STATE_TAG:
        if (char == '#') {
            state = STATE_ID;
            index++;
        }
        else if (char == '.') {
            state = STATE_CLASS
        }
        else {
            tagnameArray.push(char);
        }
        break;

    case STATE_ID:
        if (char == '.') {
            state = STATE_CLASS;
            index++;
        }
        else if (IDENTIFIERS.test(char)) {
            idArray.push(char);
        }
        else {
            throw new Error();
        }
        break;

    case STATE_CLASS:
        if (char == '.') {
            classListArray.push([]);
            index++;
        }
        else if (IDENTIFIERS.test(char)) {
            classListArray[classListArray.length - 1].push(char);
        }
        else {
            throw new Error();
        }
}