/**
 * Created by pzheng on 22/02/2017.
 */
"use strict";

var gulp = require("gulp"),
  del = require("del"),
  tsc = require("gulp-typescript"),
  sourcemaps = require('gulp-sourcemaps'),
  tsProject = tsc.createProject("tsconfig.json"),
  tslint = require('gulp-tslint'),
  concat = require('gulp-concat'),
  runSequence = require('run-sequence'),
  nodemon = require('gulp-nodemon'),
  gulpTypings = require("gulp-typings");

/**
 * Remove build directory
 */

gulp.task('clean', function(cb) {
  return del(["dist"], cb);
});

/**
 * Build Express Server
 */
gulp.task('build:server', function() {
  // Only typescript file are there
  //var tsProject = tsc.createProject('server/tsconfig.json');
  //var tsResult = gulp.src('server/src/**/*.ts')
  //  .pipe(sourcemaps.init())
  //  .pipe(tsProject());
  //return tsResult.js
  //  .pipe(sourcemaps.write())
  //  .pipe(gulp.dest('dist/server'));
  var jsResult = gulp.src(['server/src/*.js', 'server/src/**/*.js', 'server/src/**/**/*.js'])
                  .pipe(gulp.dest('dist/server'));
  return jsResult;
});

/**
 *  Lint all custom Typescript files.
 */
gulp.task('tslint', function() {
  return gulp.src("client/app/**/*.ts")
    .pipe(tslint({
      formatter: "prose"
    }))
    .pipe(tslint.report());
});
