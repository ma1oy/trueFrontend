'use strict';
// del              - Files remove
// gulpif           - Add some logic to pipes
// twig             - twig parser
// htmlmin          - html minimization
// svgstore         - svg concatenation into symbol tags
// svgmin           - svg minimization
// rename           - File rename (for svg's id's)
// rigger           - Files including (//= path/name)
// prefixer         - Automatic adding prefix for CSS rules
// uglify           - js minimization
// scss             - SASS parser
// sourcemaps       - Source maps for SASS
// cleanCss         - CSS minimization
// imagemin         - Image minimization
// imageminPngquant - Lossy compression of PNG images
// browserSync      - Browser synchronization

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

var reload = function(done) { $.browserSync.reload(); done() };

function cfgUpdate(done) {
    config      = YAML.load(configFile);
    dest    = config.dest;
    src     = {};
    watch   = config.src;
    var mf  = config.mainFiles;

    for (var key in watch) { // Get full paths to main files
        if (watch.hasOwnProperty(key)) {
            src[key] = mf.hasOwnProperty(key) ? watch[key].split('*')[0] + mf[key] : watch[key];
        }
    }

    if (config.image.inlineSvg) { // Get full path to inline svg image
        var temp = watch.inlineSvg.split('/*');
        config.image.inlineSvg =
            dest.inlineSvg + (dest.inlineSvg.split('/').pop() ? '/' : '') + temp[0].split('/').pop() + temp.pop();
    }

    done();
}

cfgUpdate(function() {});

// SVG BUILD TASK
gulp.task('build:svg', function() {
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
gulp.task('build:html', gulp.series('build:svg', function() {
    return gulp.src(src.markup)
        .pipe($.twig({data: config}))
        .pipe($.if(config.min.html, $.htmlmin({collapseWhitespace: true})))
        .pipe(gulp.dest(dest.markup));
}, function() { return $.del([dest.inlineSvg]) }));

// IMAGE BUILD TASK
gulp.task('build:img', function() {
    return gulp.src(src.image)
        .pipe($.if(config.min.image, $.imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [$.imageminPngquant()],
            interlaced: true
        })))
        .pipe(gulp.dest(dest.image));
});

// CSS BUILD TASK
gulp.task('build:css', function() {
    return gulp.src(src.style)
        .pipe($.sourcemaps.init())
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.autoprefixer(config.autoprefixer))
        .pipe($.if(config.min.css, $.cleanCss()))
        .pipe($.if(config.min.css, $.rename({ suffix: '.min' })))
        .pipe($.sourcemaps.write(dest.map))
        .pipe(gulp.dest(dest.style));
});

// JS BUILD TASK
gulp.task('build:js', function() {
    return gulp.src(src.script)
        .pipe($.rigger()) // Add dependent files
        .pipe($.sourcemaps.init())
        .pipe($.if(config.min.js, $.uglify()))
        .pipe($.if(config.min.js, $.rename({ suffix: '.min' })))
        .pipe($.sourcemaps.write(dest.map))
        .pipe(gulp.dest(dest.script));
});

// CLEAN TASK
gulp.task('clean', function(done) {
    $.del(dest.build);
    done();
});

// BUILD TASK
gulp.task('build', gulp.series(gulp.parallel('build:css', 'build:js', 'build:img'), 'build:html'));

// SERVER AND BROWSER TASK
gulp.task('sync', function (done) {
    $.browserSync.init(config.browserSync);
    done();
});

// WATCH TASK
gulp.task('watch', function(done) {
    gulp.watch([watch.markup,
                watch.inlineSvg], gulp.series('build:html', reload));
    gulp.watch( watch.style,      gulp.series('build:css',  reload));
    gulp.watch( watch.script,     gulp.series('build:js',   reload));
    gulp.watch( watch.image,      gulp.series('build:img',  reload));
    gulp.watch( configFile, gulp.series(cfgUpdate, 'build', reload));
    done();
});

// DEFAULT TASK
gulp.task('default', gulp.parallel(gulp.series('build', 'sync'), 'watch'));
