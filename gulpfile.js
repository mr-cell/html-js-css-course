var gulp = require('gulp');
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var jade = require('gulp-jade');

gulp.task('default', ['sass', 'jade'], function() {
	gulp.watch('./scss/*.scss', ['sass']);
	gulp.watch('*.jade', ['jade']);
});

gulp.task('sass', function() {
	gulp.src('./scss/*.scss')
		.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
		.pipe(gulp.dest('./css/'));
});

gulp.task('jshint', function() {
	gulp.src('./lib/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default', {verbose: 'true'}));
});

gulp.task('jade', function() {
	gulp.src('*.jade')
		.pipe(jade())
		.pipe(gulp.dest('.'));
});