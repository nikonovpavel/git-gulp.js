'use strict';

//------------------------------------------------
// var
//------------------------------------------------

//var npm package
var gulp = require('gulp'),
	 csso = require('gulp-csso'),
	 sass = require('gulp-sass'),
	 clean = require('gulp-clean'),
	 pixrem = require('gulp-pixrem'),
	 rigger = require('gulp-rigger'),
	 concat = require('gulp-concat'),
	 uglify = require('gulp-uglify'),
	 rename = require('gulp-rename'),
	 filesize = require('gulp-filesize'),
	 imagemin = require('gulp-imagemin'),
	 browserSync = require("browser-sync"),
	 combineMq = require('gulp-combine-mq'),
	 autoprefixer = require('gulp-autoprefixer'),
	 pngquant = require('imagemin-pngquant'),
	 reload = browserSync.reload;

//var src path
var path = {
	//file production
	build: {
		html: 'build/',
		css: 'build/css/',
		js: 'build/js/',
		img: 'build/img/',
	},
	//path source file
	src: {
		html: 'dev/**/*.html',
		scss: 'dev/scss/style.scss',
		js: 'dev/js/script.js',
		img: 'dev/img/**/*.*',
	},
	//path watch file
	watch: {
		html: 'dev/**/*.html',
		scss: 'dev/scss/**/*.scss',
		js: 'dev/js/**/*.js',
		img: 'dev/img/**/*.*',
	}
};

//var web server
var config = {
	server: {
		baseDir: './build'
	},
	port: 8080,
	open: true,
	notify: false
};

//------------------------------------------------
// task
//------------------------------------------------

//task web server
gulp.task('webserver', function () {
	browserSync(config);
});

//task clean
gulp.task('clean', function() {
	return gulp.src(['build/css', 'build/js', 'build/img'], {read: false})
		.pipe(clean());
});

//task html
gulp.task('html:build', function () {
	return gulp.src(path.src.html)
		.pipe(rigger())
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({stream: true}));
});

//task style
gulp.task('scss:build', function () {
	return gulp.src(path.src.scss)
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(pixrem({rootValue: '10px'}))
		.pipe(csso())
		.pipe(filesize())
		.pipe(rename({ suffix: '.min' }))
		.pipe(combineMq({beautify: false}))
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({stream: true}));
});

//task script
gulp.task('js:build', function () {
	return gulp.src(path.src.js)
		.pipe(concat('script.js'))
		.pipe(gulp.dest(path.build.js))
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify(''))
		.pipe(filesize())
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({stream: true}));
});

//task img
gulp.task('img:build', function () {
	return gulp.src(path.src.img)
		.pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
		.pipe(gulp.dest(path.build.img))
		.pipe(reload({stream: true}));
});

gulp.task('build', [
	'html:build',
	'scss:build',
	'js:build',
	'img:build'
]);

gulp.task('watch', function () {
	gulp.watch([path.watch.html], function(event, cb) {
		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
		gulp.run('html:build');
	});
	gulp.watch([path.watch.scss], function(event, cb) {
		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
		gulp.run('scss:build');
	});
	gulp.watch([path.watch.js], function(event, cb) {
		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
		gulp.run('js:build');
	});
	gulp.watch([path.watch.img], function(event, cb) {
		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
		gulp.run('img:build');
	});
});

gulp.task('default', ['webserver', 'build', 'watch']);