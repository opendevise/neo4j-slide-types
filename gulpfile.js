'use strict';
var pkg = require('./package.json'),
  autoprefixer = require('gulp-autoprefixer'),
  browserify = require('browserify'),
  buffer = require('vinyl-buffer'),
  closureCompiler = require('google-closure-compiler').gulp(),
  csso = require('gulp-csso'),
  del = require('del'),
  ghpages = require('gh-pages'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  jade = require('gulp-jade'),
  path = require('path'),
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
  //tidyOpts = {
  //  'anchor-as-name': 'false',
  //  'coerce-endtags': 'false',
  //  'drop-empty-elements': 'false',
  //  'fix-uri': 'false',
  //  'indent': 'false',
  //  'literal-attributes': 'true',
  //  'newline': 'LF',
  //  'preserve-entities': 'true',
  //  'quiet': 'true',
  //  'show-warnings': 'false',
  //  'tidy-mark': 'false',
  //  'wrap': '0'
  //},
  outputDir = 'build/bespoke',
  isDist = process.argv.indexOf('deploy') >= 0;

gulp.task('js', function() {
  // see https://wehavefaces.net/gulp-browserify-the-gulp-y-way-bb359b3f9623
  return browserify('src/scripts/main.js').bundle()
    // NOTE this error handler fills the role of plumber() when working with browserify
    .on('error', function(e) { if (isDist) { throw e; } else { gutil.log(e.stack); this.emit('end'); } })
    .pipe(source('src/scripts/main.js'))
    .pipe(buffer())
    .pipe(isDist ? closureCompiler(closureCompilerOpts) : uglify())
    .pipe(rename('build.js'))
    .pipe(gulp.dest(outputDir + '/build'));
});

gulp.task('html_jade', function() {
  return gulp.src('src/index.jade')
    .pipe(isDist ? through() : plumber())
    .pipe(jade({ pretty: '  ' }))
    .pipe(rename('index-jade.html'))
    .pipe(gulp.dest(outputDir));
});

//gulp.task('asciidoc-html', function() {
//  return gulp.src('src/index.adoc')
//    .pipe(isDist ? through() : plumber())
//    // NOTE using stdin here would cause loss of context
//    //.pipe(exec('bundle exec asciidoctor-bespoke -o - src/index.adoc', { pipeStdout: true }))
//    .pipe(exec('bundle exec asciidoctor-bespoke -T src/templates -o - src/index.adoc', { pipeStdout: true }))
//    .pipe(exec.reporter({ stdout: false }))
//    .pipe(through(function(file) {
//      var html = tidy(file.contents.toString(), tidyOpts) // NOTE based on tidy 4.9.26
//        // strip extra newlines inside <pre> tags (fixed in tidy 5.1.2)
//        .replace(new RegExp('<pre([^>]*)>\\n([\\s\\S]*?)\\n</pre>', 'g'), '<pre$1>$2</pre>\n')
//        // strip extra newline after <script> start tag for empty and single-line content
//        .replace(new RegExp('>\\n(?:(.+)\\n)?</script>', 'g'), '>$1</script>')
//        // add newline before <script> tags
//        .replace(new RegExp('><script([^>]*)>', 'g'), '>\n<script$1>');
//      file.contents = new Buffer(html);
//      this.push(file);
//    }))
//    .pipe(rename('index.html'))
//    .pipe(chmod(644))
//    .pipe(gulp.dest(outputDir));
//});

gulp.task('css', function() {
  return gulp.src('src/styles/main.styl')
    .pipe(isDist ? through() : plumber())
    .pipe(stylus({ 'include css': true, paths: ['./node_modules'] }))
    .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
    .pipe(isDist ? csso() : through())
    .pipe(rename('build.css'))
    .pipe(gulp.dest(outputDir + '/build'));
});

gulp.task('clean:html_jade', function() {
  return del(outputDir + '/index-jade.html');
});

gulp.task('clean:js', function() {
  return del(outputDir + '/build/build.js');
});

gulp.task('clean:css', function() {
  return del(outputDir + '/build/build.css');
});

gulp.task('deploy', function(done) {
  ghpages.publish(path.join(__dirname, outputDir), { logger: gutil.log }, done);
});

gulp.task('clean', ['clean:js', 'clean:html_jade', 'clean:css']);
gulp.task('build', ['js', 'html_jade', 'css']);
