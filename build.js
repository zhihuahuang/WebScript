var fs = require('fs');

function requireModule(src, dist, cb) {
    let browserify = require('browserify')();

    browserify.add(src);
    browserify.bundle()
        .on('error', function (err) {
            console.error(err);
        })
        .pipe(fs.createWriteStream(dist).on('close', cb));
}

function minifyJS(src, dist, cb) {
    var UglifyJS = require("uglify-js");

    fs.readFile(src, 'utf8', function (err, data) {
        var result = UglifyJS.minify(data);
        if (result.error) {
            console.error(result.error);
        }
        else {
            fs.writeFile(dist, result.code, 'utf8', cb);
        }
    });
}

requireModule(__dirname + '/src/index.js', __dirname + '/dist/webscript.js', function () {
    minifyJS(__dirname + '/dist/webscript.js', __dirname + '/dist/webscript.min.js', function () {
        console.log('Done!');
    });
});