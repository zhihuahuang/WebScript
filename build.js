var fs = require('fs');

function requireModule(src, dist, cb) {
    var browserify = require('browserify');
    var b = browserify();
    b.add(src);
    b.bundle()
        .on('end', cb)
        .on('error', function (err) {
            console.error(err);
        })
        .pipe(fs.createWriteStream(dist));
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