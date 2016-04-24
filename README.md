#TRUE_FRONTEND

Easy-frontend is an automatic system for build `html`, `svg`, `css`, and `javascript` based projects.

> **Note:** the system uses [`twig`](http://twig.sensiolabs.org/) template engine, [`scss`](http://sass-lang.com/) preprocessor and [`ES6`](http://www.ecma-international.org/ecma-262/6.0/) compiler [`Balel`](https://babeljs.io/) for `html`, `css` and `js` building respectively.

##Features
* `HTML` templating support;
* Auto adding `CSS` vendor prefixes (autoprefixing);
* `SCSS` preprocessor support and automatic compiling all `SCSS` files into one `CSS`;
* `CSS` and `JS` mapping;
* Inline `SVG` creation and embedding;
* Built files minimization;
* Browser synchronization and livereload;
* All system settings are available into one place (`config.yml`).
* Easy to use :)

##How to install?

####Basic installation

If you do not have `git`, `nodejs`, `npm` and `gulp` you must install them first.

> **Recomended:** if the above technologies are already installed it is highly recommended to update them.

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

To update / install `gulp`:
```sh
$ sudo npm uninstall gulp -g
$ sudo npm i gulpjs/gulp-cli#4.0 -g
```

####Main installation

Type the following commands at the command line from your project directory:

1. **Clone this repo:**

    ```sh
    $ git clone https://github.com/romanVia/easy-frontend.git
    ```

2. **Install `gulp` locally:**

    ```sh
    $ npm i gulpjs/gulp#4.0 -D
    ```

3. **Install `npm` packages:**

    ```sh
    $ npm i -D
    ```

##How to use?

Run `gulp` with the following commands:

####General commands

- **`default`** _or without command_ - build a project, launch a browser and start watching for source files' changes;
- **`build`** - build a whole project into `destination:home` folder;
- **`clean`** - remove `destination:home` folder and **all files** in it;
- **`sync`** - start a server, launch a browser and synchronize it with index file `mainFiles:markup`;
- **`watch`** - start watching for source files' changes from `source:home` folder.

####Additional commands

- **`build:html`** - parse all `twig` templates from `source:markup` folder and all inline `svg` images files from `source:inlineSvg` folder while the option `image:inlineSvg` is `true`, combine them into `mainFiles:markup` file and put it into `destination:markup` folder;
- **`build:css`** - parse all `scss` files from `source:style` folder, combine them into `mainFiles:style` file and put it into `destination:style` folder;
- **`build:js`** - parse all `js` files from `source:script` folder, combine them into `mainFiles:script` file and put it into `destination:script` folder;
- **`build:img`** - get all images from `source:image` folder, compress and put it into `destination:image` folder;
- **`build:svg`** - parse all `svg` files from `source:inlineSvg` folder, combine them into one with `<symbol>` elements and put it into `destination:inlineSvg` folder.

##Settings
You can find all system settings with the detailed description in `config.yml` file.

##License
[MIT](https://github.com/romanVia/easy-frontend/blob/master/LICENSE)
