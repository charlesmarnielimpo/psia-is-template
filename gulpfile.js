// --------------------------------
// Dependencies
// --------------------------------
var gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync').create(),
  imagemin = require('gulp-imagemin'),
  uglify = require('gulp-uglify'),
  pump = require('pump'),
  rename = require('gulp-rename'),
  plumber = require('gulp-plumber'),
  autoprefixer = require('gulp-autoprefixer');

// --------------------------------
// Paths
// --------------------------------
var scssSource = 'src/scss/**/*.scss',
  scssDest = 'build/assets/css/',
  jsSource = 'src/js/**/*.js',
  jsDest = 'build/assets/js/',
  imgSource = 'src/img/*',
  imgDest = 'build/assets/img/';

// --------------------------------
// Tasks
// --------------------------------

// Compile all SCSS files
gulp.task('sass', function () {
  return gulp.src(scssSource)
    .pipe(autoprefixer())
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'uncompressed'
    }).on('error', sass.logError))
    .pipe(rename({
      basename: 'main',
      suffix: '.min'
    }))
    .pipe(gulp.dest(scssDest))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// Minifies all JavaScript files
gulp.task('jsMinifier', function (cb) {
  pump([
      gulp.src(jsSource),
      uglify(),
      gulp.dest(jsDest)
    ],
    cb
  );
});

// Minifies all Images
gulp.task('imageMinifier', function () {
  return gulp.src(imgSource)
    .pipe(imagemin())
    .pipe(gulp.dest(imgDest));
});

// Watcher
gulp.task('watch', function () {

  // Sync Browser
  browserSync.init({
    server: {
      baseDir: './build'
    },
  });

  gulp.watch(scssSource, ['sass']);
  gulp.watch(jsSource, ['jsMinifier']);
  gulp.watch(imgSource, ['imageMinifier']);
  gulp.watch(['build/*.html', 'build/assets/css/*.css', 'build/assets/js/*.js', 'src/scss/**/*.scss']).on('change', browserSync.reload);
});

// One for all task runner or simply default
gulp.task('default', ['sass', 'jsMinifier', 'imageMinifier', 'watch'], function () {});