var gulp         =  require('gulp'),
	sass         =  require('gulp-sass'),
	browserSync  =  require('browser-sync'),
	gulpConcat   =  require('gulp-concat'),
	gulpUglifyJs =  require('gulp-uglifyjs'),
	cssNano      =  require('gulp-cssnano'),
	rename       =  require('gulp-rename'),
	del          =  require('del'), // Подключаем библиотеку для удаления файлов и папок
	imagemin     =  require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
	pngquant     =  require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
	cache        =  require('gulp-cache'), // Подключаем библиотеку кеширования
	autoprefixer =  require('gulp-autoprefixer');// Подключаем библиотеку для автоматического добавления префиксов




	;

gulp.task("sass", function () {
	return	gulp.src('app/sass/**/*.scss')
	.pipe(sass())
	.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream:true}))
});

// gulp.task('script',function () {
// 	return gulp.src([
// 		'app/libs/jquery/dist/jquery.min.js',
// 		'app/libs/jquery/dist/jquery.min.js'
// 		])
// 	.pipe(gulpConcat('libs.min.js'))
// 	.pipe(gulpUglifyJs())
// 	.pipe(gulp.dest('app/js'))
// });

// gulp.task('css-libs', ['sass'], function() {
// 	return gulp.src('app/css/libs.css') // Выбираем файл для минификации
// 		.pipe(cssnano()) // Сжимаем
// 		.pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
// 		.pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
// });

gulp.task("browser-sync", function () {
	browserSync ({
		server:{
			baseDir:'app'			
		},
		notify: false
	});
});

gulp.task("watch",['browser-sync','sass'], function () {
	gulp.watch('app/sass/**/*.scss',['sass']);
	gulp.watch('app/*.html',browserSync.reload);
	gulp.watch('app/js/**/*.js',browserSync.reload);
	
});

gulp.task('clean', function() {
	return del.sync('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('img', function() {
	return gulp.src('app/img/**/*') // Берем все изображения из app
		.pipe(cache(imagemin({ // С кешированием
		// .pipe(imagemin({ // Сжимаем изображения без кеширования
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))/**/)
		.pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});

gulp.task('build', ['clean', 'img', 'sass'], function() {

	var buildCss = gulp.src([ // Переносим библиотеки в продакшен
		'app/css/main.css',
		// 'app/css/libs.min.css'
		])
	.pipe(gulp.dest('dist/css'))

	var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
	.pipe(gulp.dest('dist/fonts'))

	var buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
	.pipe(gulp.dest('dist/js'))

	var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
	.pipe(gulp.dest('dist'));

});

gulp.task('clear', function (callback) {
	return cache.clearAll();
})

gulp.task('default', ['watch']);