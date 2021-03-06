const browserify = require('browserify');
const babelify = require('babelify');
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const replace = require('gulp-replace');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const uglifyModule = require('./gulp-uglify-module');

gulp.task('main', function () {
    browserify(__dirname + '/src/index.js')
    .transform(babelify.configure({
        presets: [
            ["es2015", { "loose": true }]
        ],
    }))
    .ignore('entities/maps/entities.json')
    .ignore('entities/maps/xml.json')
    .bundle()
    .pipe(source('webscript.js'))
    .pipe(gulp.dest(__dirname + '/dist'))
    .pipe(buffer())
    .pipe(uglifyModule())
    .pipe(uglify())
    .pipe(rename('webscript.min.js'))
    .pipe(gulp.dest(__dirname + '/dist'));
});

gulp.task('default', ['main']);