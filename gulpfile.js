var gulp = require('gulp')
var ts = require("gulp-typescript");
var browserify = require("browserify");
var tsify = require("tsify");
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var tsProject = ts.createProject("tsconfig.json");
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');

gulp.task("default", function () {
    return browserify({
        basedir: '.',
        debug: false,
        entries: ['src/GIFStream.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('lib'));
});