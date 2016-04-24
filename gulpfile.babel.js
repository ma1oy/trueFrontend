'use strict';
// babel            - For ES2015 compiling
// del              - Files remove
// gulpif           - Add some logic to pipes
// twig             - twig parser
// htmlmin          - html minimization
// svgstore         - svg concatenation into symbol tags
// svgmin           - svg minimization
// rename           - File rename (for svg's id's)
// prefixer         - Automatic adding prefix for CSS rules
// uglify           - js minimization
// scss             - SASS parser
// sourcemaps       - Source maps for SASS
// cleanCss         - CSS minimization
// imagemin         - Image minimization
// imageminPngquant - Lossy compression of PNG images
// browserSync      - Browser synchronization

const cdir = 'config.yml',
      gulp = require('gulp'),
      YAML = require('yamljs');
var   conf = YAML.load(cdir), $ = {}, dest = {}, src = {}, watch = {}, data = {};
const plg  = conf.plg;

Object.keys(require('./package.json')['devDependencies']).forEach((pkg) => {
        $[pkg.replace('gulp-', '').replace(/-[a-z]/g, (_, ofs, str) => {
            return str[++ofs].toUpperCase();
        })] = require(pkg);
    });

function reload(done) {
    $.browserSync.reload();
    done()
}

function cinit(done) {
    conf  = YAML.load(cdir);
    dest  = conf.dir.dest;
    watch = conf.dir.src;
    data  = conf.prj;
    let m = data.mainFiles;

    for (let key in watch) { // Get full paths to main files
        if (watch.hasOwnProperty(key)) {
            src[key] = m.hasOwnProperty(key) ? watch[key].split('*')[0] + m[key] : watch[key];
        }
    }

    if (data.image.inlineSvg) { // Get full path to inline svg image
        let temp = watch.inlineSvg.split('/*');
        data.image.inlineSvg =
            dest.inlineSvg + (dest.inlineSvg.split('/').pop() ? '/' : '') + temp[0].split('/').pop() + temp.pop();
    }

    done();
}

cinit(function() {});

// SVG BUILD TASK
gulp.task('build:svg', () => {
    return gulp.src(src.inlineSvg)
        .pipe($.if(data.min.svg, $.svgmin()))
        .pipe($.rename(function (path) { // Rename files for beauty id's
            let name = path.dirname.split(path.sep);
            name[0] == '.' ? name.shift() : true;
            name.push(path.basename);
            path.basename = name.join('-');
        }))
        .pipe($.svgstore({ inlineSvg: true })) // svg concatenation into symbols
        .pipe(gulp.dest(dest.inlineSvg));
});

// HTML BUILD TASK
gulp.task('build:html', gulp.series('build:svg', () => {
    return gulp.src(src.markup)
        .pipe($.twig({data: data}))
        .pipe($.if(data.min.html, $.htmlmin({collapseWhitespace: true})))
        .pipe(gulp.dest(dest.markup));
}, () => { return $.del([dest.inlineSvg]) }));

// IMAGE BUILD TASK
gulp.task('build:img', () => {
    return gulp.src(src.image)
        .pipe($.if(data.min.image, $.imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [$.imageminPngquant()],
            interlaced: true
        })))
        .pipe(gulp.dest(dest.image));
});

// CSS BUILD TASK
gulp.task('build:css', () => {
    return gulp.src(src.style)
        .pipe($.sourcemaps.init())
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.autoprefixer(plg.autoprefixer))
        .pipe($.if(data.min.css, $.cleanCss()))
        .pipe($.if(data.min.css, $.rename({ suffix: '.min' })))
        .pipe($.sourcemaps.write(dest.sourceMap))
        .pipe(gulp.dest(dest.style));
});

// JS BUILD TASK
gulp.task('build:js', () => {
    return gulp.src(src.script)
        .pipe($.sourcemaps.init())
        .pipe($.babel({ presets: ['es2015'] }))
        .pipe($.if(data.min.js, $.uglify()))
        .pipe($.if(data.min.js, $.rename({ suffix: '.min' })))
        .pipe($.sourcemaps.write(dest.sourceMap))
        .pipe(gulp.dest(dest.script));
});

// CLEAN TASK
gulp.task('clean', (done) => {
    $.del(dest.build);
    done();
});

// BUILD TASK
gulp.task('build', gulp.series(gulp.parallel('build:css', 'build:js', 'build:img'), 'build:html'));

// SERVER AND BROWSER TASK
gulp.task('sync', (done) => {
    $.browserSync.init(plg.browserSync);
    done();
});

// WATCH TASK
gulp.task('watch', (done) => {
    gulp.watch(data.image.inlineSvg ? [watch.inlineSvg, watch.markup] :
               watch.markup, gulp.series('build:html',   reload));
    gulp.watch(watch.style,  gulp.series('build:css',    reload));
    gulp.watch(watch.script, gulp.series('build:js',     reload));
    gulp.watch(watch.image,  gulp.series('build:img',    reload));
    gulp.watch(cdir,         gulp.series(cinit, 'build', reload));
    done();
});

// DEFAULT TASK
gulp.task('default', gulp.parallel(gulp.series('build', 'sync'), 'watch'));
