var gulp = require('gulp');
var browserSync = require('browser-sync'); 
var jshint = require('gulp-jshint'); 
var concat = require('gulp-concat'); 
var uglify = require('gulp-uglify'); 
var rename = require('gulp-rename'); 

// 静态服务器 
gulp.task('browser-sync', function() {
  browserSync.init({
    files: "src/**",
    server: {
      baseDir: "src/"
    }
  });
});

// js语法检查
gulp.task('jshint', function() {
  return gulp.src('src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// js文件合并及压缩
gulp.task('minifyjs', function() {
  return gulp.src('src/js/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/js'));
});

// 事件监听
gulp.task('watch', function() {
  gulp.watch('src/js/*.js', ['jshint','minifyjs']);
});

gulp.task('default',['browser-sync','watch']);