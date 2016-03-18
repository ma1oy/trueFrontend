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
    browserSync = require("browser-sync"),      // Browser synchronization
    reload      = browserSync.reload,           // Browser page reload
    YAML        = require('yamljs');

// var mainFiles = {
//     index: 'index.twig',
//     script: 'main.js',
//     style:  'style.scss'
// };

var mypath = {
    config:     'config.yml',
    dest: {
        home:   './build',
        markup: 'build/',
        css:    'build/',
        js:     'build/',
        svg:    'build/svg/',
        img:    'build/img/'
    },
    src: {
        home:   './src',
        markup: 'src/templates/index.twig',
        js:     'src/js/main.js',
        css:    'src/css/style.scss',
        svg:    'src/svg/**/[^_]*.svg',
        img:    'src/img/**/[^_]*.*'
    },
    watch: {
        markup:   'src/templates/*.twig', // ? [^_]
        js:     'src/js/**/[^_]*.js',
        css:    'src/css/**/*.scss', // ? [^_]
        svg:    'src/svg/**/[^_]*.svg',
        img:    'src/img/**/[^_]*.*'
    }
};

// var config = YAML.load(mypath.config);

var config = YAML.load(mypath.config);

// DEV SERVER CONFIG
var serverConfig = {
    server: {
        baseDir: "./build"
    },
    //tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "EASY_FRONTEND"
};

// SVG BUILD TASK
gulp.task('svg:build', function () {
    return gulp
        .src(mypath.src.svg)
        .pipe(svgmin())                         // svg minimization
        .pipe(rename(function (path) {          // Rename files for beauty id's
            var name = path.dirname.split(path.sep);
            name[0] == '.' ? name.shift() : true;
            name.push(path.basename);
            path.basename = name.join('-');
        }))
        .pipe(svgstore({ inlineSvg: true }))    // svg concatenation into symbols
        .pipe(gulp.dest(mypath.dest.svg));      // Save to build path
});

// HTML BUILD WITH INLINE SVG TASK
gulp.task('htmlsvg:build', ['svg:build'], function () {
    return gulp
        .src(mypath.src.markup)
        .pipe(twig({
            // data: YAML.parse(require('fs').readFileSync(config, 'utf8'))
            data: YAML.load(mypath.config)
            // data: config
        }))
        .pipe(gulp.dest(mypath.dest.markup));    // Save to build path
});

// HTML BUILD
gulp.task('html:build', ['htmlsvg:build'], function() {
    return del([mypath.dest.svg]);             // Remove svg build folder
});

// IMAGE BUILD TASK
gulp.task('image:build', function () {
    return gulp
        .src(mypath.src.img)
        .pipe(imagemin({                        // Images minimization
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(mypath.dest.img));      // Save to build path
        //.pipe(reload({stream: true}));          // Server reload
});

// CSS BUILD TASK
gulp.task('css:build', function () {
    return gulp
        .src(mypath.src.css)
        .pipe(sourcemaps.init())                // Maps initialization
        .pipe(scss())                           // ssss compile
        .pipe(prefixer({                        // Add vendor prefixes
            browsers: ['last 5 versions']
        }))
        .pipe(cssmin())                         // css minimization
        .pipe(sourcemaps.write())               // Write maps
        .pipe(gulp.dest(mypath.dest.css));     // Save to build path
        //.pipe(reload({stream: true}));          // Server reload
});

// CSS CLEAN TASK
gulp.task('css:clean', function() {
    return del(['.gulp-scss-cache', '.sass-cache']);
});

// JS BUILD TASK
gulp.task('js:build', function () {
    return gulp
        .src(mypath.src.js)
        .pipe(rigger())                         // Add dependent files
        .pipe(sourcemaps.init())                // Maps initialization
        .pipe(uglify())                         // js minimization
        .pipe(sourcemaps.write())               // Write maps
        .pipe(gulp.dest(mypath.dest.js));      // Save to build path
        //.pipe(reload({stream: true}));          // Server reload
});

// CLEAN TASK
gulp.task('clean', function() {
    return del(mypath.dest.home);
    //return del(Object.keys(mypath.build).map(function (key) {return mypath.build[key]}));
});

// CONFIG UPDATE TASK
gulp.task('config:update', function() {
    config = YAML.load(mypath.config);
});

// REBUILD TASK
gulp.task('rebuild', [
    'html:build',
    'css:build',
    'js:build',
    'image:build'
]);

// BUILD TASK
gulp.task('build', ['clean'], function() {
    gulp.start('rebuild');
});

// WEBSERVER TASK
gulp.task('live', function() {
    browserSync(serverConfig);
});

// WATCH TASK
gulp.task('watch', function(){
    gulp.watch(mypath.config, ['config:update', 'build', reload]);
    gulp.watch([mypath.watch.markup, mypath.watch.svg], ['html:build', reload]);
    gulp.watch(mypath.watch.css, ['css:build', reload]);
    gulp.watch(mypath.watch.js, ['js:build', reload]);
    gulp.watch(mypath.watch.img, ['image:build', reload]);
});

// DEFAULT TASK
gulp.task('default', ['build', 'live', 'watch']);
