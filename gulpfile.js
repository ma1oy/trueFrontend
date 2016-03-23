'use strict';

var gulp        = require('gulp'),
    YAML        = require('yamljs'),            // YAML parser
    del         = require('del'),               // Files remove
    gulpif      = require('gulp-if'),
    twig        = require('gulp-twig'),         // twig parser
    htmlmin     = require('gulp-htmlmin'),
    //es          = require('event-stream'),      //"event-stream":       "^3.3.2",
    //concat      = require('gulp-concat'),       // File concatenation // "gulp-concat":        "^2.6.0",
    svgstore    = require('gulp-svgstore'),     // svg concatenation into symbol tags
    svgmin      = require('gulp-svgmin'),       // svg minimization
    rename      = require('gulp-rename'),       // File rename (for svg's id's)
    rigger      = require('gulp-rigger'),       // Files including (//= path/name)
    prefixer    = require('gulp-autoprefixer'), // Automatic adding prefix for CSS rules
    uglify      = require('gulp-uglify'),       // js minimization
    scss        = require('gulp-scss'),         // SASS parser
    sourcemaps  = require('gulp-sourcemaps'),   // Source maps for SASS
    cssmin      = require('gulp-clean-css'),    // CSS minimization
    imagemin    = require('gulp-imagemin'),     // Image minimization
    pngquant    = require('imagemin-pngquant'), // Lossy compression of PNG images
    browserSync = require('browser-sync').create();      // Browser synchronization

var configFile  = 'config.yml',
    config      = YAML.load(configFile),
    watch       = config.src,
    dest        = config.dest,
    src         = {},
    min         = config.min;//.build;

for (var key in watch) {
    if (watch.hasOwnProperty(key)) {
        src[key] = config.mainFiles.hasOwnProperty(key) ?
            watch[key].split('*')[0] + config.mainFiles[key] : watch[key];
    }
}
if (config.image.inlineSvg) {
    var temp = src.inlineSvg.split('/*');
    config.image.inlineSvg = dest.inlineSvg + (dest.inlineSvg.split('/').pop() ? '/' : '') +
        temp[0].split('/').pop() + temp.pop();
}

// SVG BUILD TASK
gulp.task('svg:build', function() {
    return gulp
        .src(src.inlineSvg)
        .pipe(gulpif(config.min.svg, svgmin()))                         // svg minimization
        .pipe(rename(function (path) {          // Rename files for beauty id's
            var name = path.dirname.split(path.sep);
            name[0] == '.' ? name.shift() : true;
            name.push(path.basename);
            path.basename = name.join('-');
        }))
        .pipe(svgstore({ inlineSvg: true }))    // svg concatenation into symbols
        .pipe(gulp.dest(dest.inlineSvg));     // Save to build path
});

// HTML BUILD WITH INLINE SVG TASK
gulp.task('html:build', ['svg:build'], function() {
    gulp
        .src(src.markup)
        .pipe(twig({ data: config }))
        .pipe(gulpif(config.min.html, htmlmin({ collapseWhitespace: true })))
        .pipe(gulp.dest(dest.markup));          // Save to build path
    del([dest.inlineSvg]);                      // Remove svg build folder
});

// IMAGE BUILD TASK
gulp.task('img:build', function() {
    gulp.src(src.image)
        .pipe(gulpif(config.min.image, imagemin({                        // Images minimization
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()],
            interlaced: true
        })))
        .pipe(gulp.dest(dest.image));         // Save to build path
});

gulp.task('scss:copy', function() {
    gulp.src(watch.style)
        .pipe(gulp.dest(dest.build + 'source/'))
});

// CSS BUILD TASK
gulp.task('css:build', function() {
    return gulp.src(src.style)
        // .pipe(gulp.dest(dest.style + 'source'))
        .pipe(sourcemaps.init())                // Maps initialization
        .pipe(scss())                           // scss compile
        .pipe(prefixer(config.autoprefixer))
        .pipe(gulpif(config.min.css, cssmin()))
        .pipe(gulpif(config.min.css, rename({ suffix: '.min' })))
        .pipe(sourcemaps.write('.'))               // Write maps
        .pipe(gulp.dest(dest.style));       // Save to build path
});

// CSS CLEAN TASK
gulp.task('css:clean', function() {
    del(['.gulp-scss-cache', '.sass-cache']);
});

// JS BUILD TASK
gulp.task('js:build', function() {
    gulp.src(src.script)
        .pipe(rigger())                         // Add dependent files
        .pipe(sourcemaps.init())                // Maps initialization
        .pipe(gulpif(config.min.js, uglify()))
        .pipe(gulpif(config.min.js, rename({ suffix: '.min' })))
        .pipe(sourcemaps.write())               // Write maps
        .pipe(gulp.dest(dest.script));          // Save to build path
});

// CLEAN TASK
gulp.task('clean', function() {
    del(dest.build);
});

// CONFIG UPDATE TASK
gulp.task('config:update', function() {
    config = YAML.load(configFile);
});

// PREBUILD TASK
gulp.task('prebuild', ['css:build', 'js:build', 'img:build']);

// REBUILD TASK
gulp.task('rebuild', ['prebuild'], function() {
    gulp.start('html:build');
});

gulp.task('build', ['clean', 'rebuild']);

// SERVER AND BROWSER TASK
gulp.task('sync', function () {
    browserSync.init(config.browserSync);
});

// WATCH TASK
gulp.task('watch', function(){
    // gulp.watch(configFile, ['config:update', 'build', browserSync.reload]);
    // gulp.watch(configFile).on('change', function() {
    //     config = YAML.load(configFile);
    //     gulp.start('build');
    //     browserSync.reload();
    // });
    gulp.watch([watch.markup, watch.inlineSvg], ['html:build', browserSync.reload]);
    gulp.watch(watch.style, ['css:build', browserSync.reload]);
    gulp.watch(watch.script, ['js:build', browserSync.reload]);
    gulp.watch(watch.image, ['img:build', browserSync.reload]);
});

// DEFAULT TASK
gulp.task('default', ['build', 'sync', 'watch']);
