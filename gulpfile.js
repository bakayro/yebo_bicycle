const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const image = require('gulp-image');

function html() {
	return gulp.src('src/**/*.html')
		.pipe(gulp.dest('./build/'))
}

function style_sass() {
	return gulp.src('src/sass/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('src/css'))
		.pipe(browserSync.stream());
}

function styles() {
	return gulp.src('src/css/**/*.css')
		// .pipe(sourcemaps.init())
		// .pipe(concat('style.css'))
		.pipe(autoprefixer({
			cascade: false
		}))
		// .pipe(sourcemaps.write())
		.pipe(gulp.dest('./build/css'))
		.pipe(browserSync.stream());
}

function scripts() {
	return gulp.src('src/js/**/*.js')
		// .pipe(sourcemaps.init())
		/*.pipe(concat('main.js'))*/
		.pipe(uglify({
			toplevel: true
		}))
		// .pipe(sourcemaps.write())
		.pipe(gulp.dest('./build/js'))
		.pipe(browserSync.stream());
}

function fonts() {
	return gulp.src('src/fonts/**/*.*')
		.pipe(gulp.dest('./build/fonts'))
}


function images() {
	return gulp.src('src/img/**/*.*')
		// .pipe(image())
		.pipe(gulp.dest('./build/img'));
}


function watch() {
	browserSync.init({
		server: {
			baseDir: "./src"
		},
		tunnel: true
	});

	gulp.watch('./src/css/**/*.css', styles);
	/*exports.style = style;*/
	gulp.watch('./src/sass/**/*.scss', style_sass);
	gulp.watch('./src/js/**/*.js', scripts);
	gulp.watch('./src/fonts/**/*.*', fonts);
	gulp.watch('./src/*.html', browserSync.reload);
}

function clean() {
	return del(['build/*']);
}

gulp.task('html', html);
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('style_sass', style_sass);
gulp.task('images', images);
gulp.task('fonts', fonts);
gulp.task('watch', watch);



gulp.task('build', gulp.series(clean,
	gulp.parallel(html, style_sass, styles, images, scripts, fonts)
));

gulp.task('dev', gulp.series('build', 'watch'));