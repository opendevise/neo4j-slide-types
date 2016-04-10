'use strict';
var pkg = require('./package.json'),
  autoprefixer = require('gulp-autoprefixer'),
  browserify = require('browserify'),
  buffer = require('vinyl-buffer'),
  closureCompiler = require('google-closure-compiler').gulp(),
  csso = require('gulp-csso'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  jade = require('gulp-jade'),
  plumber = require('gulp-plumber'), // plumber prevents pipe breaking caused by errors thrown by plugins
  rename = require('gulp-rename'),
  source = require('vinyl-source-stream'),
  stylus = require('gulp-stylus'),
  through = require('through'),
  uglify = require('gulp-uglify'),
  closureCompilerOpts = {
    compilation_level: 'SIMPLE', // ADVANCED breaks bespoke-fullscreen
    warning_level: 'QUIET',
    language_in: 'ES5_STRICT',
    language_out: 'ES5'
  },
  isDist = gutil.env.dist,
  outputDir = 'build/bespoke';

gulp.task('js', function() {
  // see https://wehavefaces.net/gulp-browserify-the-gulp-y-way-bb359b3f9623
  return browserify('src/app/scripts/main.js').bundle()
    // NOTE this error handler fills the role of plumber() when working with browserify
    .on('error', function(e) { if (isDist) { throw e; } else { gutil.log(e.stack); this.emit('end'); } })
    .pipe(source('src/app/scripts/main.js'))
    .pipe(buffer())
    .pipe(isDist ? closureCompiler(closureCompilerOpts) : uglify())
    .pipe(rename('build.js'))
    .pipe(gulp.dest(outputDir + '/build'));
});

gulp.task('html_jade', function() {
  return gulp.src('src/content/index.jade')
    .pipe(isDist ? through() : plumber())
    .pipe(jade({ pretty: '  ' }))
    .pipe(rename('index-jade.html'))
    .pipe(gulp.dest(outputDir));
});

gulp.task('css', function() {
  return gulp.src('src/app/styles/main.styl')
    .pipe(isDist ? through() : plumber())
    .pipe(stylus({ 'include css': true, paths: ['./node_modules'] }))
    .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
    .pipe(isDist ? csso() : through())
    .pipe(rename('build.css'))
    .pipe(gulp.dest(outputDir + '/build'));
});

gulp.task('build', ['js', 'html_jade', 'css']);
