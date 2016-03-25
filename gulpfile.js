'use strict';
// del         - Files remove
// gulpif      - Add some logic to pipes
// twig        - twig parser
// htmlmin     - html minimization
// svgstore    - svg concatenation into symbol tags
// svgmin      - svg minimization
// rename      - File rename (for svg's id's)
// rigger      - Files including (//= path/name)
// prefixer    - Automatic adding prefix for CSS rules
// uglify      - js minimization
// scss        - SASS parser
// sourcemaps  - Source maps for SASS
// cssmin      - CSS minimization
// imagemin    - Image minimization
// pngquant    - Lossy compression of PNG images
// browserSync - Browser synchronization
//?concat      - File concatenation ["gulp-concat": "^2.6.0"]
//?es          - ["event-stream": "^3.3.2"]

var configFile  = 'config.yml',
    gulp        = require('gulp'),
    YAML        = require('yamljs'),
    config      = YAML.load(configFile),
    $ = {}, dest = {}, src = {}, watch = {};

Object.keys(require('./package.json')['devDependencies'])
    .forEach(function (pkg) {
        $[pkg.replace('gulp-', '').replace(/-[a-z]/g, function(str, offs, s) {
            return s[++offs].toUpperCase();
        })] = require(pkg);
    });
var reload = $.browserSync.reload;

function configUpdate() {
    config      = YAML.load(configFile);
    dest    = config.dest;
    src     = {};
    watch   = config.src;
    var mf  = config.mainFiles;

    for (var key in watch) { // Get full paths to main files
        if (watch.hasOwnProperty(key)) {
            src[key] = mf.hasOwnProperty(key) ?
            watch[key].split('*')[0] + mf[key] : watch[key];
        }
    }

    if (config.image.inlineSvg) { // Get full path to inline svg image
        var temp = watch.inlineSvg.split('/*');
        config.image.inlineSvg = dest.inlineSvg + (dest.inlineSvg.split('/').pop() ? '/' : '') +
            temp[0].split('/').pop() + temp.pop();
    }
}
configUpdate();

// CONFIG UPDATE TASK
gulp.task('config:update', function(done) {
    configUpdate();
    done();
});

// SVG BUILD TASK
gulp.task('svg:build', function() {
    return gulp.src(src.inlineSvg)
        .pipe($.if(config.min.svg, $.svgmin()))
        .pipe($.rename(function (path) { // Rename files for beauty id's
            var name = path.dirname.split(path.sep);
            name[0] == '.' ? name.shift() : true;
            name.push(path.basename);
            path.basename = name.join('-');
        }))
        .pipe($.svgstore({ inlineSvg: true })) // svg concatenation into symbols
        .pipe(gulp.dest(dest.inlineSvg));
});

// HTML BUILD TASK
gulp.task('html:build', gulp.series('svg:build', function() {
    return gulp.src(src.markup)
        .pipe($.twig({data: config}))
        .pipe($.if(config.min.html, $.htmlmin({collapseWhitespace: true})))
        .pipe(gulp.dest(dest.markup));
}, function() { return $.del([dest.inlineSvg]) }));

// IMAGE BUILD TASK
gulp.task('img:build', function() {
    return gulp.src(src.image)
        .pipe($.if(config.min.image, $.imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [$.imageminPngquant()],
            interlaced: true
        })))
        .pipe(gulp.dest(dest.image));
});

// gulp.task('scss:copy', function() {
//     gulp.src(watch.style)
//         .pipe(gulp.dest(dest.build + 'source/'))
// });

// CSS BUILD TASK
gulp.task('css:build', function() {
    return gulp.src(src.style)
        .pipe($.sourcemaps.init())
        .pipe($.scss())
        .pipe($.autoprefixer(config.autoprefixer))
        .pipe($.if(config.min.css, $.cleanCss()))
        .pipe($.if(config.min.css, $.rename({ suffix: '.min' })))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(dest.style));
});

// CSS CLEAN TASK
gulp.task('css:clean', function() {
    return $.del(['.gulp-scss-cache', '.sass-cache']);
});

// JS BUILD TASK
gulp.task('js:build', function() {
    return gulp.src(src.script)
        .pipe($.rigger()) // Add dependent files
        .pipe($.sourcemaps.init())
        .pipe($.if(config.min.js, $.uglify()))
        .pipe($.if(config.min.js, $.rename({ suffix: '.min' })))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(dest.script));
});

// CLEAN TASK
gulp.task('clean', function() {
    return $.del(dest.build);
});

// BUILD TASK
gulp.task('build', gulp.series(gulp.parallel('css:build', 'js:build', 'img:build'), 'html:build'));

// SERVER AND BROWSER TASK
gulp.task('sync', function () {
    $.browserSync.init(config.browserSync);
});

// WATCH TASK
gulp.task('watch', function(done) {
    gulp.watch(configFile, gulp.series('config:update', 'build', reload));
    gulp.watch([watch.markup, watch.inlineSvg], gulp.series('html:build', reload));
    gulp.watch(watch.style, gulp.series('css:build', reload));
    gulp.watch(watch.script, gulp.series('js:build', reload));
    gulp.watch(watch.image, gulp.series('img:build', reload));
    done();
});

// DEFAULT TASK
gulp.task('default', gulp.parallel(gulp.series('build', 'sync'), 'watch'));
