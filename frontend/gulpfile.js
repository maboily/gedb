var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var templateCache = require('gulp-angular-templatecache');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var watch = require('gulp-watch');

// Pre-loaded assets (e.g. requireJS)
var PreloadJSAssets = [
    'additional_libs/requirejs/require.js'
];

// Mobile javascript assets
var MobileJSAssets = [
    'additional_libs/angular/angular.min.js',
    'additional_libs/angular-ui-router/release/angular-ui-router.js',
    'additional_libs/angular-breadcrumb/release/angular-breadcrumb.js',
    'additional_libs/angular-sanitize/angular-sanitize.js',
    'additional_libs/ngprogress/build/ngProgress.js',
    'additional_libs/angular-foundation/mm-foundation-tpls.js',
    'additional_libs/marked/lib/marked.js',
    'additional_libs/angular-marked/angular-marked.js'
];

// Desktop javascript assets
var DesktopJSAssets = [
    'additional_libs/angular/angular.min.js', // 122 KB
    'additional_libs/angular-ui-router/release/angular-ui-router.js', // 28 KB
    'additional_libs/angular-breadcrumb/release/angular-breadcrumb.js', // 4 KB
    'additional_libs/angular-animate/angular-animate.js', // 14 KB
    'additional_libs/angular-sanitize/angular-sanitize.js', // 5 KB
    'additional_libs/ngprogress/build/ngProgress.js', // 3 KB
    'additional_libs/angular-foundation/mm-foundation-tpls.js', // 41 KB
    'additional_libs/marked/lib/marked.js', // 10 KB
    'additional_libs/angular-marked/angular-marked.js', // 1 KB
    'additional_libs/angular-vertilize/angular-vertilize.js', // 2 KB
    'additional_libs/ng-file-upload/angular-file-upload.js' // 16 KB
];

// Administration javascript assets
var AdminJSAssets = [
    'additional_libs/ace-builds/src-noconflict/ace.js'
];

gulp.task('unify-javascript-preload', function() {
    gulp.src(PreloadJSAssets)
        .pipe(plumber())
        .pipe(concat('preload.js'))
        .pipe(uglify())
        .pipe(gulp.dest('../public'));
});

gulp.task('unify-javascript-mobile', function() {
    gulp.src(MobileJSAssets)
        .pipe(plumber())
        .pipe(concat('mobile.js'))
        .pipe(uglify())
        .pipe(gulp.dest('../public'));
});

gulp.task('unify-javascript-desktop', function() {
    gulp.src(DesktopJSAssets)
        .pipe(plumber())
        .pipe(concat('desktop.js'))
        .pipe(uglify())
        .pipe(gulp.dest('../public'));
});

gulp.task('unify-javascript-admin', function() {
    gulp.src(AdminJSAssets)
        .pipe(plumber())
        .pipe(concat('admin.js'))
        .pipe(uglify())
        .pipe(gulp.dest('../public'));
});

// SASS assets, by load order
var SASSAssets = [
    'sass/**/*.sass',
    'sass/**/*.scss'
];
gulp.task('unify-sass', function() {
    gulp.src('styles.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('../public'));
});

// Merge Angular JS files
var AngularFiles = [
    'ng-source/*.js',
    'ng-source/**/*.js'
];
gulp.task('ng-merge-js', function() {
    gulp.src(AngularFiles)
        .pipe(plumber())
        .pipe(concat('ng-app.js'))
        //.pipe(uglify())
        .pipe(gulp.dest('../public'));
});

// Merge Angular partials
var AngularPartials = [
    'ng-source/*.html',
    'ng-source/**/*.html'
];
gulp.task('ng-merge-partials', function() {
    gulp.src(AngularPartials)
        .pipe(plumber())
        .pipe(templateCache('ng-partials.js', { module: 'gedbApp' }))
        .pipe(uglify())
        .pipe(gulp.dest('../public'));
});



gulp.task('unify', ['unify-javascript-preload', 'unify-javascript-desktop', 'unify-javascript-mobile', 'unify-javascript-admin', 'unify-sass', 'ng-merge-js', 'ng-merge-partials']);
gulp.task('ng-merge', ['ng-merge-js', 'ng-merge-partials']);
gulp.task('all', ['unify', 'ng-merge']);
gulp.task('watch', function() {
    watch(PreloadJSAssets, function(files, cb) { gulp.start('unify-javascript-preload', cb); });
    watch(DesktopJSAssets, function(files, cb) { gulp.start('unify-javascript-desktop', cb); });
    watch(MobileJSAssets, function(files, cb) { gulp.start('unify-javascript-mobile', cb); });
    watch(AdminJSAssets, function(files, cb) { gulp.start('unify-javascript-admin', cb); });
    watch(SASSAssets, function(files, cb) { gulp.start('unify-sass', cb); });
    watch(AngularFiles, function(files, cb) { gulp.start('ng-merge-js', cb); });
    watch(AngularPartials, function(files, cb) { gulp.start('ng-merge-partials', cb); });
});