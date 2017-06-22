var gulp           = require('gulp'),
		gutil          = require('gulp-util' ),
		sass           = require('gulp-sass'),
		browserSync    = require('browser-sync'),
		concat         = require('gulp-concat'),
		uglify         = require('gulp-uglify'),
		cleanCSS       = require('gulp-clean-css'),
		rename         = require('gulp-rename'),
		del            = require('del'),
		cache          = require('gulp-cache'),
		autoprefixer   = require('gulp-autoprefixer'),
		ftp            = require('vinyl-ftp'),
		notify         = require("gulp-notify");
var config = require('./config/config.js');

// Скрипты проекта

gulp.task('common-js', function() {
	return gulp.src(['app/js/common.js',])
	.pipe(concat('common.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('dist/js'));
});

gulp.task('js', ['common-js'], function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
        'app/libs/foundation/js/foundation.min.js',
		'app/js/common.min.js' // Всегда в конце
		])
	.pipe(concat('scripts.min.js'))
	// .pipe(uglify()) // Минимизировать весь js (на выбор)
	.pipe(gulp.dest('dist/js'));
});

gulp.task('sass', function() {
	return gulp.src('app/sass/**/*.sass')
	.pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer(['last 15 versions']))
	//.pipe(cleanCSS()) // Опционально, закомментировать при отладке
	.pipe(gulp.dest('dist/css'));
	//.pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['sass', 'js'], function() {
	gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['js']);
	gulp.watch('dist/**', ['deploy']);
});

gulp.task('deploy', function() {

	var conn = ftp.create({
		host:      config.host,
		user:      config.ftpUser,
		password:  config.ftpPassword,
		parallel:  10,
		log: gutil.log
	});

	var globs = ['dist/**'];
	return gulp.src(globs, {buffer: false})
	.pipe(conn.dest('/public-html/wp-content/themes/'+config.themeName+'/framework/dist/'));

});

gulp.task('removedist', function() { return del.sync('dist'); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['watch']);
