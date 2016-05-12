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

To install `nodejs` and `npm` type the following commands at your command line `(Ctrl + Alt + T)`:

```sh
$ sudo apt-get update
$ sudo apt-get i nodejs
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
- **`build:img`** - get images from `dir.src.img` folder, compress them and put into `dir.dest.img` folder;
- **`watch:cfg`** - watch for `config.yml` file changes and if it changed start `build` command;
- **`watch:html`** - watch for file changes in `dir.watch.html` or `dir.src.html` directory if the first do not exist and if it changed start `build:html` command;
- **`watch:css`** - watch for file changes in `dir.watch.css` or `dir.src.css` directory if the first do not exist and if it changed start `build:css` command;
- **`watch:js`** - watch for file changes in `dir.watch.js` or `dir.src.js` directory if the first do not exist and if it changed start `build:js` command;
- **`watch:svg`** - watch for file changes in `dir.watch.svg` or `dir.src.svg` directory if the first do not exist and if it changed start `build:svg` command;
- **`watch:img`** - watch for file changes in `dir.watch.img` or `dir.src.img` directory if the first do not exist and if it changed start `build:img` command;
- **`clean:html`** - delete `dir.dest.html` directory and all files in it;
- **`clean:css`** - delete `dir.dest.css` directory and all files in it;
- **`clean:js`** - delete `dir.dest.js` directory and all files in it;
- **`clean:svg`** - delete `dir.dest.svg` directory and all files in it;
- **`clean:img`** - delete `dir.dest.img` directory and all files in it;

##Settings

You can find all system settings with the detailed description in `config.yml` file.

##License

[MIT](https://github.com/romanVia/easy-frontend/blob/master/LICENSE)
