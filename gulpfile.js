'use strict';

var gulp        = require('gulp'),
    del         = require('del'),               // Files remove
    twig        = require('gulp-twig'),         // twig parser
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
    browserSync = require('browser-sync').create(),      // Browser synchronization
    YAML        = require('yamljs'),            // YAML parser
    reload      = browserSync.reload;           // Browser page reload

var dir = {
    config:     'config.yml',
    mainFiles: {
        markup: 'index.twig',
        style:  'style.scss',
        script: 'main.js'
    },
    dest: {
        home:   './build/',
        markup: './build/',
        style:  './build/',
        script: './build/',
        img:    './build/img/',
        imgIn:  './build/svg/'
    },
    src: {
        home:   './src',
        markup: './src/templates/**/*.twig', // [^_]
        style:  './src/styles/**/*.scss', // [^_]
        script: './src/scripts/**/[^_]*.js',
        img:    ['./src/images/**/[^_]*.*', '!./src/images/inline/**'],
        imgIn:  './src/images/inline/**/[^_]*.svg'
    }
};

var config = YAML.load(dir.config);

var mainSrc = dir.src;
for (var key in mainSrc) {
    if (mainSrc.hasOwnProperty(key)) {
        switch(key) {
            case 'markup': case 'style': case 'script':
            mainSrc[key] = mainSrc[key].split('/').slice(0, -2).join('/') + '/' + dir.mainFiles[key];
                break;
            default: break;
        }
    }
}

// SVG BUILD TASK
gulp.task('svg:build', function () {
    return gulp
        .src(mainSrc.imgIn)
        .pipe(svgmin())                         // svg minimization
        .pipe(rename(function (path) {          // Rename files for beauty id's
            var name = path.dirname.split(path.sep);
            name[0] == '.' ? name.shift() : true;
            name.push(path.basename);
            path.basename = name.join('-');
        }))
        .pipe(svgstore({ inlineSvg: true }))    // svg concatenation into symbols
        .pipe(gulp.dest(dir.dest.imgIn));       // Save to build path
});

// HTML BUILD WITH INLINE SVG TASK
gulp.task('html-svg:build', ['svg:build'], function () {
    return gulp
        .src(mainSrc.markup)
        .pipe(twig({
            // data: YAML.parse(require('fs').readFileSync(config, 'utf8'))
            // data: YAML.load(dir.config)
            data: config
        }))
        .pipe(gulp.dest(dir.dest.markup));      // Save to build path
});

// HTML BUILD
gulp.task('html:build', ['html-svg:build'], function() {
    return del([dir.dest.imgIn]);               // Remove svg build folder
});

// IMAGE BUILD TASK
gulp.task('img:build', function () {
    return gulp
        .src(mainSrc.img)
        .pipe(imagemin({                        // Images minimization
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(dir.dest.img));         // Save to build path
});

// CSS BUILD TASK
gulp.task('css:build', function () {
    return gulp
        .src(mainSrc.style)
        .pipe(sourcemaps.init())                // Maps initialization
        .pipe(scss())                           // scss compile
        .pipe(prefixer(config.autoprefixer))
        .pipe(cssmin())                         // css minimization
        .pipe(sourcemaps.write())               // Write maps
        .pipe(rename({
            basename:   'style',
            suffix:     '.min'
        }))
        .pipe(gulp.dest(dir.dest.style));       // Save to build path
});

// CSS CLEAN TASK
gulp.task('css:clean', function() {
    return del(['.gulp-scss-cache', '.sass-cache']);
});

// JS BUILD TASK
gulp.task('js:build', function () {
    return gulp
        .src(mainSrc.script)
        .pipe(rigger())                         // Add dependent files
        .pipe(sourcemaps.init())                // Maps initialization
        .pipe(uglify())                         // js minimization
        .pipe(sourcemaps.write())               // Write maps
        .pipe(rename({
            basename:   'script',
            suffix:     '.min'
        }))
        .pipe(gulp.dest(dir.dest.script));      // Save to build path
});

// CLEAN TASK
gulp.task('clean', function() {
    return del(dir.dest.home);
    //return del(Object.keys(mypath.build).map(function (key) {return mypath.build[key]}));
});

// CONFIG UPDATE TASK
gulp.task('config:update', function() {
    config = YAML.load(dir.config);
});

// REBUILD TASK
gulp.task('rebuild', [
    'html:build',
    'css:build',
    'js:build',
    'img:build'
]);

// BUILD TASK
gulp.task('build', ['clean'], function() {
    gulp.start('rebuild');
});

// // WEBSERVER TASK
// gulp.task('live', function() {
//     browserSync(config.browserSync);
// });

// WEBSERVER TASK
gulp.task('live', function () {
    browserSync.init(config.browserSync);
});

// WATCH TASK
gulp.task('watch', function(){
    gulp.watch(dir.config, ['config:update', 'build', reload]);
    gulp.watch([dir.src.markup, dir.src.imgIn], ['html:build', reload]);
    gulp.watch(dir.src.style, ['css:build', reload]);
    gulp.watch(dir.src.script, ['js:build', reload]);
    gulp.watch(dir.src.img, ['img:build', reload]);
});

gulp.task('clearCache', function() {
    // Still pass the files to clear cache for
    gulp.src('./*.*')
        .pipe(cache.clear());

    // Or, just call this for everything
    cache.clearAll();
});

// DEFAULT TASK
gulp.task('default', ['build', 'live', 'watch']);
