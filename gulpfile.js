'use strict';
const configFileDir = './config.js';
let [plugins, conf, dest, src, watch, project, pluginParams] = [{}];
Object.keys(require('./package.json').devDependencies).forEach(pkg => {
    plugins[pkg.replace('gulp-', '').replace(/-[a-z]/g, (_, offset, str) => {
        return str[++offset].toUpperCase();
    })] = require(pkg);
});
const gulp = plugins.gulp, combine = plugins.streamCombiner2.obj;

function configInit(done = () => {}) {
    conf = require(configFileDir);
    project = conf.project;
    pluginParams = conf.plugins;
    dest = conf.directories.dest;
    src = conf.directories.src;
    watch = Object.assign({}, src, conf.directories.watch);
    done();
}

configInit();
let runSettings = project.runSettings,
    preprocessors = project.preprocessors,
    preprocessorOptions = project.preprocessorOptions;

function go() { return plugins.through2.obj(function (file, enc, cb) { cb(null, file); }); }

function no(done) { done(); }

function reload(done) {
    plugins.browserSync.reload();
    done();
}

// HTML BUILD TASK
gulp.task('build:html', (done) => {
    combine(
        gulp.src(src.html),
        preprocessors.html ? plugins[preprocessors.html](preprocessorOptions[preprocessors.html]) : go(),
        runSettings.html.min ? plugins.htmlmin(pluginParams.htmlmin) : go(),
        gulp.dest(dest.html)
    ).on('error', plugins.notify.onError({title: 'build:html'}));
    done();
});
// CSS BUILD TASK
gulp.task('build:css', (done) => {
    combine(
        gulp.src(src.css),
        plugins.sourcemaps.init(),
        // preprocessors.css ? plugins[preprocessors.css](preprocessorOptions[preprocessors.css]).on('error', plugins[preprocessors.css].logError) : go(),
        preprocessors.css ? plugins[preprocessors.css](preprocessorOptions[preprocessors.css]) : go(),
        plugins.autoprefixer(pluginParams.autoprefixer),
        runSettings.css.min ? plugins.cleanCss(pluginParams.cleanCss) : go(),
        plugins.sourcemaps.write(dest.srcMap),
        gulp.dest(dest.css)
    ).on('error', plugins.notify.onError({title: 'build:css'}));
    done();
});
// JS BUILD TASK
gulp.task('build:js', (done) => {
    combine(
        gulp.src(src.js),
        plugins.sourcemaps.init(),
        preprocessors.js ? plugins[preprocessors.js](preprocessorOptions[preprocessors.js]) : go(),
        runSettings.js.min ? plugins.uglify(pluginParams.uglify) : go(),
        plugins.sourcemaps.write(dest.srcMap),
        gulp.dest(dest.js)
    ).on('error', plugins.notify.onError({title: 'build:js'}));
    done();
});
// SVG BUILD TASK
gulp.task('build:svg', (done) => {
    combine(
        gulp.src(src.svg),
        runSettings.svg.min ? plugins.svgmin(pluginParams.svgmin) : go(),
        plugins.rename(function (path) { // Rename files for beauty id's
            let name = path.dirname.split(path.sep);
            name[0] === '.' ? name.shift() : true;
            name.push(path.basename);
            path.basename = name.join('-');
        }),
        plugins.svgstore(pluginParams.svgstore), // svg concatenation into symbols
        gulp.dest(dest.svg)
    ).on('error', plugins.notify.onError({title: 'build:svg'}));
    done();
});
// IMAGE BUILD TASK
gulp.task('build:img', (done) => {
    combine(
        gulp.src(src.img),
        runSettings.img.min ? plugins.imagemin(Object.assign(pluginParams.imagemin, {
            use: [plugins.imageminPngquant()]
        })) : go(),
        gulp.dest(dest.img)
    ).on('error', plugins.notify.onError({title: 'build:img'}));
    done();
});
gulp.task('watch:cfg ', () => gulp.watch(configFileDir, gulp.series(configInit, 'build', reload)));
gulp.task('watch:html', () => gulp.watch(watch.html, gulp.series('build:html', reload)));
gulp.task('watch:css', () => gulp.watch(watch.css, gulp.series('build:css', reload)));
gulp.task('watch:js', () => gulp.watch(watch.js, gulp.series('build:js', reload)));
gulp.task('watch:svg', () => gulp.watch(watch.svg, gulp.series('build:svg', reload)));
gulp.task('watch:img', () => gulp.watch(watch.img, gulp.series('build:img', reload)));
gulp.task('clean:html', (done) => {
    plugins.del(dest.html);
    done();
});
gulp.task('clean:css ', (done) => {
    plugins.del(dest.css);
    done();
});
gulp.task('clean:js  ', (done) => {
    plugins.del(dest.js);
    done();
});
gulp.task('clean:svg ', (done) => {
    plugins.del(dest.svg);
    done();
});
gulp.task('clean:img ', (done) => {
    plugins.del(dest.img);
    done();
});
// BUILD TASK
gulp.task('build', gulp.series(gulp.parallel(
    runSettings.css.build ? 'build:css' : no,
    runSettings.js.build ? 'build:js' : no,
    runSettings.svg.build ? 'build:svg' : no,
    runSettings.img.build ? 'build:img' : no),
    runSettings.html.build ? 'build:html' : no
));
// WATCH TASK
gulp.task('watch', gulp.parallel(
    runSettings.html.watch ? 'watch:html' : no,
    runSettings.css.watch ? 'watch:css' : no,
    runSettings.js.watch ? 'watch:js' : no,
    runSettings.svg.watch ? 'watch:svg' : no,
    runSettings.img.watch ? 'watch:img' : no,
    'watch:cfg '
));
// CLEAN TASK
gulp.task('clean', (done) => {
    let arr = runSettings, out = [];
    for (let key in arr) {
        if (arr.hasOwnProperty(key)) {
            if (arr[key].clean) out.push(dest[key]);
        }
    }
    plugins.del(out, pluginParams.del);
    done();
});
// SERVER AND BROWSER TASK
gulp.task('sync', (done) => {
    plugins.browserSync.init(pluginParams.browserSync);
    done();
});
// DEFAULT TASK
gulp.task('default', gulp.parallel(gulp.series('build', 'sync'), 'watch'));
