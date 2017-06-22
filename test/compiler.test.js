var assert = require('assert');

var compiler = require('../src/compiler');

describe('Compiler', function () {
    describe('Single Tag', function () {
        var testCases = [{
            html: '<button id="main">Click Me >></button>',
            code: "h('button#main','Click Me >>')"
        },{
            html: '<input class="form-control col-sm-6" autofocus>',
            code: "h('input.form-control.col-sm-6',{autofocus:''})"
        },{
            html: '<a id="main" class="link primary-link" href="http://example.com"></a>',
            code: "h('a#main.link.primary-link',{href:'http://example.com'})"
        }];

        testCases.forEach(function (item) {
            it(item.html + ' = ' + item.code, function () {
                assert.equal(compiler(item.html), item.code);
            });
        });
    });
    describe('Children Tag', function () {
        // var testCases = [{
        //     html: '<ul><li>1</li><li>2</li></ul>',
        //     code: ''
        // }];
        //
        // testCases.forEach(function (item) {
        //     it(item.html + ' = ' + item.code, function () {
        //         assert.equal(compiler(item.html), item.code);
        //     });
        // });
    })
});