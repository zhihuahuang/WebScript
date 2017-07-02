var Observer = require('../src/observer');

var data = {
    name: 'Jack',
    extra: {
        height: 180,
        weight: 75
    }
};

var observer = new Observer(data);
observer.attach(function (event) {
    console.log(event.target + ': ' + JSON.stringify(data)); // Tom
});

data.name = 'Tom';
data.extra = {
    height: 175,
    weight: 65
};
data.extra.height = 178;