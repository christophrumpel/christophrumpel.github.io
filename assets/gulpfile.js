var gulp 		= require('gulp');
var sass 		= require('gulp-sass')
var minifyCSS 	= require('gulp-minify-css');
var rename 		= require("gulp-rename");
var concat 		= require('gulp-concat');
var uglify 		= require('gulp-uglify');
var imagemin    = require('gulp-imagemin');
var prefix      = require('gulp-autoprefixer');
var livereload  = require('gulp-livereload')


var paths = {
    sass: './sass',
    styles: './sass/style.scss',
    css: '../_includes',
    scripts: ['./scripts'],
    origimages: './orig-images',
    images: './images'
};


gulp.task('styles', function () {
    gulp.src(paths.styles)
        .pipe(sass())
        .pipe(prefix("last 1 version", "> 1%", "ie 8", "ie 7"))
        .pipe(gulp.dest(paths.css))
        .pipe(minifyCSS())
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest(paths.css))
        .pipe(livereload());
});

// gulp.task('scripts', function() {
//  	gulp.src(['./scripts'])
//     	.pipe(concat('all.js'))
//     	.pipe(gulp.dest('./scripts/'))
// });

gulp.task('images', function () {
    gulp.src(paths.origimages + '/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest(paths.images));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
    gulp.watch(paths.sass + '/**/*', ['styles']);
    gulp.watch(paths.origimages + '/**/*', ['images']);
});

gulp.task('default', ['styles', 'images', 'watch']);