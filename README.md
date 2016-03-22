#EASY-FRONTEND

Easy-frontend is an automatic system for build `html`, `svg`, `css`, and `javascript` based projects.

> **Note:** the system uses `twig` and `scss` preprocessors for `html` and `css` building respectively.

##Features
* `HTML` templating support (used `Twig`);
* Auto adding `CSS` vendor prefixes (autoprefixing);
* `SCSS` preprocessor support and automatic compiling all `SCSS` files into one `CSS`;
* Inline mapping compiled `CSS` to source style sheets;
* Inline `SVG` creation and embedding;
* Built files minimization;
* Browser synchronization and livereload;
* All system settings are available into one place (`config.yml`).
* Easy to use :)

##How to install?

If you do not have `git`, `nodejs` and `npm` you must install them first.

> **Important:** you need `nodejs v0.10.25` and higher to work.

To check the version of your `nodejs`:

```sh
$ nodejs -v
```

To update `nodejs`:

```sh
$ sudo npm cache clean -f
$ sudo npm install -g n
$ sudo n stable
```

Type the following commands at the command line from your project directory:

1. **Clone this repo:**

    ```sh
    $ git clone https://github.com/romanVia/easy-frontend.git
    ```

2. **Instal `gulp` globally:**

    ```sh
    $ npm install --global gulp
    ```

3. **Install packages:**

    ```sh
    $ npm install --save-dev
    ```

> **Note:** for points 2 and 3 you can use shorthand: `npm i -g gulp -D`

##How to use?

Run `gulp` with the following commands:

####General commands

- **`build`** - build the whole project into `destination:home` folder;
- **`rebuild`** - remove `destination:home` folder and build the project again;
- **`prebuild`** - build only _images_, _styles_ and _scripts_, but not _markup_ and _inline images_;
- **`default`** _or without command_ - build a project, launch a browser and start watching for source files' changes.

####Additional commands

- **`html:build`** - parse all `twig` templates from `source:markup` folder and all inline `svg` images files from `source:inlineSvg` folder while the option `image:inlineSvg` is `true`, combine them into `mainFiles:markup` file and put it into `destination:markup` folder;
- **`css:build`** - parse all `scss` files from `source:style` folder, combine them into `mainFiles:style` file and put it into `destination:style` folder;
- **`css:clean`** - remove `scss` preprocessor's cache;
- **`js:build`** - parse all `js` files from `source:script` folder, combine them into `mainFiles:script` file and put it into `destination:script` folder;
- **`img:build`** - get all images from `source:image` folder, compress and put it into `destination:image` folder;
- **`svg:build`** - parse all `svg` files from `source:inlineSvg` folder, combine them into one with `<symbol>` elements and put it into `destination:inlineSvg` folder;
- **`clean`** - remove `destination:home` folder and **all files** in it;
- **`sync`** - start the server, launch the browser and synchronize it with index file `mainFiles:markup`;
- **`watch`** - start watching for source files' changes from `source:home` folder.

##Settings
You can find all system settings with the detailed description in `config.yml` file.

##License
[MIT](https://github.com/romanVia/easy-frontend/blob/master/LICENSE)
