var gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  cssnano = require('gulp-cssnano'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  imagemin = require('gulp-imagemin'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify'),
  cache = require('gulp-cache'),
  livereload = require('gulp-livereload'),
  del = require('del');

var webpack        = require('gulp-webpack');

// require in the webpack config we just created in
// our root folder or inline this file
var webpack_config = require('./config/webpack.config.js');

// Get all the files built and placed into the public root folder
gulp.task('build', function () {
  gulp.src(['dist/main.js'])
  // start at public/main and pipe through webpack with our configs
    .pipe(webpack(webpack_config))

    .pipe(gulp.dest('dist'));
});

// Watch all files and run our build process
// !be careful not to watch for the build files
// themselves else you will end up with a recursive build
gulp.task('watch', function () {
  gulp.watch(['app/**/*.js', 'app/app.js', 'app/**/*.html', 'app/**/*.scss'], function() {
    gulp.run('build');
  });
});


gulp.task('default', ['build','watch']);