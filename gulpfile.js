const browserify = require('browserify');
const babelify = require('babelify');
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

gulp.task('default', function () {
    browserify(__dirname + '/src/index.js')
    .transform(babelify.configure({
        presets: ["es2015"]
    }))
    .bundle()
    .pipe(source('webscript.js'))
    .pipe(gulp.dest(__dirname + '/dist'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(rename('webscript.min.js'))
    .pipe(gulp.dest(__dirname + '/dist'));
});