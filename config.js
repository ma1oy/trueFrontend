module.exports = {
//################################################# PROJECT SETTINGS ###################################################
    project: {
        preprocessors: { // Preprocessors
            html: false,
            css: 'sass',
            js: 'babel',
        },
        preprocessorOptions: { // Preprocessors options
            sass: {
                outputStyle: 'compressed',
            },
            babel: {
                presets: ['es2015'],
            }
        },
        runSettings: { // Built files settings
            html: {min: 1, clean: 1, build: 1, watch: 1},
            css: {min: 1, clean: 1, build: 1, watch: 1},
            js: {min: 1, clean: 1, build: 1, watch: 1},
            svg: {min: 1, clean: 1, build: 0, watch: 0},
            img: {min: 1, clean: 0, build: 0, watch: 0},
        },
    },
//################################################# PLUGINS SETTINGS ###################################################
    plugins: {
        htmlmin: {
            collapseWhitespace: true,
        },
        cleanCss: {
            compatibility: 'ie8',
        },
        uglify: {},
        svgmin: {
            js2svg: {
                // pretty: true
            },
            plugins: [
                // {
                //     removeDoctype: false,
                // },
                // {
                //     removeComments: false,
                // },
                // {
                //     cleanupNumericValues: {
                //         floatPrecision: 2,
                //     }
                // },
                // {
                //     convertColors: {
                //         names2hex: false,
                //         rgb2hex: false,
                //     }
                // }
            ],
        },
        imagemin: {
            progressive: true,
            svgoPlugins: [
                {
                    removeViewBox: false,
                },
            ],
            // use: imageminPngquant(),
            interlaced: true,
        },
        svgstore: {
            inlineSvg: true,
        },
        del: {
            //force: true, // allow deleting the current working directory and files/folders outside it
            //dryRun: true, // see what would be deleted
        },
        autoprefixer: { // Vendor prefix auto adding settings
            browsers: ['last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
            cascade: false,
        },
        browserSync: { // Server starting and browser synchronization
            server: {
                baseDir: 'build/',
                // index: 'public.html',
                // directory: true,
            },
            // tunnel: true,
            // host: 'myhost',
            // port: 9000,
            // proxy: 'yourlocal.dev',
            logPrefix: 'BROWSER',
        },
    },
//############################################### DIRECTORIES SETTINGS #################################################
    directories: {
        dest: { // Destination directories for built files
            html: 'build/',
            css: 'build/css/',
            js: 'build/js/',
            svg: 'build/img/inline',
            img: 'build/img/',
            srcMap: 'maps/',
        },
        src: { // Directories of source files for building
            html: 'src/index.html',
            css: 'src/css/style.scss',
            js: 'src/js/**/*.js',
            svg: 'src/img/inline/**/*.svg',
            img: ['src/img/**/*.*', '!src/img/inline/**'],
        },
        watch: { // Directories of files for watching which will use src directories when not presented
            html: 'src/*.html',
            css: 'src/css/**/*.scss',
            // js: 'src/js/**/main.js',
        },
    },
};
