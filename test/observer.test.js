const assert = require('assert');

delete global.Proxy;

const Observer = require('../src/observer');

describe('Observer', function () {

    this.timeout(300);

    it('Modify property', function (done) {
        let data = {
            property: 1
        };
        let observer = new Observer(data);
        observer.attach(function () {
            assert.ok(true);
            done();
        });

        observer.target.property = 2;
    });

    it('Set Property', function (done) {
        let data = {
        };
        let observer = new Observer(data);
        observer.attach(function () {
            assert.ok(true);
            done();
        });

        observer.target.property = 1;
    });

    it('Delete Property', function (done) {
        let data = {
            property: 1
        };
        let observer = new Observer(data);
        observer.attach(function () {
            assert.ok(true);
            done();
        });

        delete observer.target.property;
    });

    it('Modify Object property', function (done) {
        let data = {
            object: {
                property: 1
            }
        };
        let observer = new Observer(data);
        observer.attach(function () {
            assert.ok(true);
            done();
        });

        observer.target.object.property = 2;
    });

    it('Set Object property', function (done) {
        let data = {
            object: {
            }
        };
        let observer = new Observer(data);
        observer.attach(function () {
            assert.ok(true);
            done();
        });

        observer.target.object.property = 1;
    });

    it('Delete Object property', function (done) {
        let data = {
            object: {
            }
        };
        let observer = new Observer(data);
        observer.attach(function () {
            assert.ok(true);
            done();
        });

        delete observer.target.object.property;
    });

    it('Modify Array item', function (done) {
        let data = [1];
        let observer = new Observer(data);
        observer.attach(function () {
            assert.ok(true);
            done();
        });

        observer.target[0] = 2;
    });

    it('Array Push', function (done) {
        let data = [];
        let observer = new Observer(data);
        observer.attach(function () {
            assert.ok(true);
            done();
        });

        observer.target.push(1);
    });

    it('Modify Object Array Property', function (done) {
        let data = [{
            property: 1
        }];
        let observer = new Observer(data);
        observer.attach(function () {
            assert.ok(true);
            done();
        });

        observer.target[0].property = 2;
    });

});