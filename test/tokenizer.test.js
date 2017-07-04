const assert = require('assert');

const tokenizer = require('../src/tokenizer');

describe('Template', function () {
    describe('HTML', function () {
        let testCases = [{
            text: '<button>Click Me</button>',
            code: "var html='<button>Click Me</button>';"
        }];

        testCases.forEach(function (item) {
            it(item.text + ' = ' + item.code, function () {
                assert.equal(template(item.text), item.code);
            });
        });
    });
    describe('Var Output', function () {
        let testCases = [{
            text: '<p>I am ${ name }</p>',
            code: "var html='<p>I am '+(name)+'</p>';"
        },{
            text: '<p>${ isAndroid ? \'Android\' : \'iOS\'}</p>',
            code: "var html='<p>'+(isAndroid ? 'Android' : 'iOS')+'</p>';"
        }];

        testCases.forEach(function (item) {
            it(item.text + ' = ' + item.code, function () {
                assert.equal(template(item.text), item.code);
            });
        });
    });
    describe('Condition Control', function () {
        let testCases = [{
            text: '< if (isTrue) { ><p>true</p>< } else { ><p>false</p>< } >',
            code: "var html='';if (isTrue) {html+='<p>true</p>';} else {html+='<p>false</p>';}html+='';"
        }];

        testCases.forEach(function (item) {
            it(item.text + ' = ' + item.code, function () {
                assert.equal(template(item.text), item.code);
            });
        });
    });
});