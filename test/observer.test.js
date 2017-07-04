const assert = require('assert');

const Observer = require('../src/observer');

describe('Observer', function () {

    this.timeout(1);

    it('object', function (done) {
        let data = {
            object: {
                prop1: 1
            }
        };
        let observer = new Observer(data);
        observer.attach(function () {
            assert.ok(true);
            done();
        });

        data.object = {
            prop2: 2
        };
    });

    it('object-set-property', function (done) {
        let data = {
            object: {
                prop1: 1
            }
        };
        let observer = new Observer(data);
        observer.attach(function () {
            assert.ok(true);
            done();
        });

        data.object.prop1 = 2;
    });

    it('object-add-property', function (done) {
        let data = {
            object: {
                prop1: 1
            }
        };
        let observer = new Observer(data);
        observer.attach(function () {
            assert.ok(true);
            done();
        });

        data.object.prop2 = 2;
    });

    it('object-delete-property', function (done) {
        let data = {
            object: {
                prop1: 1
            }
        };
        let observer = new Observer(data);
        observer.attach(function () {
            assert.ok(true);
            done();
        });

        delete data.object.prop1;
    });

    it('array', function (done) {
        let data = {
            array: [1]
        };
        let observer = new Observer(data);
        observer.attach(function () {
            assert.ok(true);
            done();
        });

        data.array = [2];
    });

    it('array-push', function (done) {
        let data = {
            array: [1]
        };
        let observer = new Observer(data);
        observer.attach(function () {
            assert.ok(true);
            done();
        });

        data.array.push(2);
    });
});