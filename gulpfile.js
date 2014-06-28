var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

var env,
    coffeeSources,
    jsSources,
    htmlSources,
    jsonSources,
    outputDir,
    sassStyle;



env = process.env.NODE_ENV || 'development';

if (env === 'development') {
    outputDir = 'builds/development/';
    sassStyle = 'expanded';
} else {
    outputDir = 'builds/production/';
    sassStyle = 'compressed';
}

coffeeSources = ['components/coffee/tagline.coffee'];
jsSources = [
    'components/scripts/*'
]
htmlSources = [outputDir + '*.html']
sassSources = ['components/sass/style.scss']
jsonSources = [outputDir + 'data/*.json']

gulp.task('log', function() {
    gutil.log('worflows')
})

gulp.task('coffee', function() {
    gulp.src(coffeeSources)
        .pipe(coffee({
                bare: true
            })
            .on('error', gutil.log))
        .pipe(gulp.dest('components/scripts'))
});

gulp.task('js', function() {
    gulp.src(jsSources)
        .pipe(concat('script.js'))
        .pipe(browserify())
        .pipe(gulp.dest(outputDir + 'js'))
        .pipe(connect.reload())
});

gulp.task('compass', function() {
    gulp.src(sassSources)
        .pipe(compass({
            sass: 'components/sass',
            image: outputDir + 'images',
            style: sassStyle
        }))
        .pipe(gulp.dest(outputDir + 'css'))
        .on('error', gutil.log)
        .pipe(connect.reload())
});

gulp.task('connect', function() {
    connect.server({
        root: outputDir,
        livereload: true
    });

})

gulp.task('watch', function() {
    gulp.watch(coffeeSources, ['coffee']);
    gulp.watch(jsSources, ['js'])
    gulp.watch('components/sass/*.scss', ['compass'])
    gulp.watch(htmlSources, ['html'])
    gulp.watch(htmlSources, ['json'])

})

gulp.task('html', function() {
    gulp.src(htmlSources)
        .pipe(connect.reload())
})

gulp.task('json', function() {
    gulp.src(jsonSources)
        .pipe(connect.reload())
})

gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'connect', 'watch'])