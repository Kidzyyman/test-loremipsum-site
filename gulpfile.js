const gulp = require('gulp')
const browserSync = require('browser-sync')
const sass = require('gulp-sass')(require('sass'))
const cleanCSS = require('gulp-clean-css')
const autoprefixer = require('gulp-autoprefixer')
const rename = require('gulp-rename')
const imagemin = require('gulp-imagemin')
const htmlmin = require('gulp-htmlmin')
const fileInclude = require('gulp-file-include')

gulp.task('server', function () {
	browserSync({
		server: {
			baseDir: 'dist',
		},
		reloadOnRestart: true,
	})

	gulp.watch('src/*.html').on('change', browserSync.reload)
})

gulp.task('styles', function () {
	return gulp
		.src('src/sass/**/*.+(scss|sass)')
		.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(rename({ suffix: '.min', prefix: '' }))
		.pipe(autoprefixer())
		.pipe(cleanCSS({ compatibility: 'ie8' }))
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream())
})

gulp.task('watch', function () {
	gulp.watch('dist/**/*.html').on('change', browserSync.reload)
	gulp.watch('src/sass/**/*.+(scss|sass|css)', gulp.parallel('styles'))
	gulp.watch('src/js/**/*.js').on('change', gulp.parallel('scripts'))
	gulp.watch('src/fonts/**/*').on('change', gulp.parallel('fonts'))
	gulp.watch('src/icons/**/*').on('change', gulp.parallel('icons'))
	gulp.watch('src/img/**/*').on('change', gulp.parallel('images'))
})

gulp.task('html', function () {
	return gulp
		.src('src/*.html')
		.pipe(
			fileInclude({
				prefix: '@@',
				basepath: 'src/',
			})
		)
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.stream())
})

gulp.task('scripts', function () {
	return gulp.src('src/js/**/*.js').pipe(gulp.dest('dist/js'))
})

gulp.task('fonts', function () {
	return gulp.src('src/fonts/**/*').pipe(gulp.dest('dist/fonts'))
})

gulp.task('icons', function () {
	return gulp.src('src/icons/**/*').pipe(gulp.dest('dist/icons'))
})

gulp.task('images', function () {
	return gulp.src('src/img/**/*').pipe(imagemin()).pipe(gulp.dest('dist/img'))
})

gulp.task(
	'default',
	gulp.parallel(
		'watch',
		'server',
		'styles',
		'html',
		'scripts',
		'fonts',
		'icons',
		'images'
	)
)
