var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var less = require('gulp-less');
var minifycss = require('gulp-minify-css');

    paths = {
        root: './',
        dist:{
            root: 'dist/js/'
        }
    };

    framework = {
        filename: 'framework',
        jsFiles: [
            '../../lib/build/js/framework.js',
        ]
    };


    // Concat & Minify JS
    gulp.task('minify', function(){
        return gulp.src(framework.jsFiles)
            .pipe(concat(framework.filename + '.js'))
            .pipe(gulp.dest(paths.dist.root))
            .pipe(rename(framework.filename + '.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest(paths.dist.root));
    });

    //spaLessToCss
    gulp.task('spaLessToCss', function () {
        gulp.src('./assets/less/style.single.less')
            .pipe(less())
            .pipe(gulp.dest('./assets/css'));
    });

    // 压缩spa的css文件
    gulp.task('minifycss',['spaLessToCss'], function (){
        return gulp.src('./assets/css/style.single.css')
            .pipe(concat('style.css'))
            .pipe(gulp.dest('./assets/css'))
            .pipe(minifycss())
            .pipe(rename('style.single.css'))
            .pipe(gulp.dest('./assets/css'));
    });

// Default
gulp.task('default', ['minify']);
