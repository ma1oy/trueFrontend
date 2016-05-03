#TRUE_FRONTEND

Easy-frontend is an automatic system for build `html`, `svg`, `css`, and `javascript` based projects.

> **Note:** you need to rename or remove `gulpfile.js` before adding some changes into `gulpfile.bubel.js` to take effect.

##Features

* Any preprocessor support and automatic compiling;
* Built files minimization;
* Browser synchronization and livereload;
* `CSS` and `JS` mapping;
* Auto adding `CSS` vendor prefixes;
* Inline `SVG` creation;
* All settings are available into one place.
* Easy to use :)

##How to install?

###Basic installation

If you do not have `git`, `nodejs`, `npm` and `gulp` you must install them first.

> **Important:** the installation commands in this manual are only for Ubuntu. For other systems use [google](https://www.google.com/#q=how+to+install)'s help

Type the following commands at your command line `(Ctrl + Alt + T)`.

Before installation:

```sh
$sudo apt-get update
```

To install `nodejs`:

```sh
$ sudo apt-get i nodejs
```

To install `npm`:

```sh
$ sudo apt-get i npm
```

To install `gulp`:

```sh
$ sudo npm i gulpjs/gulp-cli#4.0 -g
```

> **Warning:** if the above programs are already installed it is highly recommended to update them.

To update `nodejs`:

```sh
$ sudo npm cache clean -f
$ sudo npm i n -g
$ sudo n stable
```

To update `npm`:

```sh
$ sudo npm i npm -g
```

To update `gulp`:

```sh
$ sudo npm uninstall gulp -g
$ sudo npm i gulpjs/gulp-cli#4.0 -g
```

###Main installation

Type the following commands from your project directory:

1. **Clone this repo:**
    ```sh
    $ git clone https://github.com/ma1oy/trueFrontend.git
    ```

2. **Install `npm` packages:**
    ```sh
    $ npm i
    ```

##How to use?

Run `gulp` with the following commands:

####General commands

- **`default`** _or without command_ - build a whole project, launch a browser and start watching for source files' changes;
- **`build`** - build a whole project;
- **`clean`** - remove built files;
- **`sync`** - start the server and synchronize the browser;
- **`watch`** - start watching for source files' changes.

####Additional commands

- **`build:html`** - parse files from `dir.src.html` folder, build them and put into `dir.dest.html` folder;
- **`build:css`** - parse files from `dir.src.css` folder, build them and put into `dir.dest.css` folder;
- **`build:js`** - parse files from `dir.src.js` folder, build them and put into `dir.dest.js` folder;
- **`build:svg`** - parse `svg` files from `source:inlineSvg` folder, combine them into one with `<symbol>` elements and put into `dir.dest.svg` folder;
- **`build:img`** - get images from `dir.src.img` folder, compress them and put into `dir.dest.img` folder.

##Settings

You can find all system settings with the detailed description in `config.yml` file.

##License

[MIT](https://github.com/romanVia/easy-frontend/blob/master/LICENSE)
