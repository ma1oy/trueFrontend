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

> **Note:** you need `nodejs v0.10.25` and higher to work.

To check the version of your `nodejs`:

```sh
nodejs -v
```

To update `nodejs`:

```sh
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
```

Type the following commands at the command line from your project directory:

1. Clone this repo:

    ```sh
    git clone https://github.com/romanVia/easy-frontend.git
    ```

2. Instal `gulp` globally:

    ```sh
    npm install -g gulp
    ```

3. Install packages:

    ```sh
    npm install
    ```

##How to use?

Run `gulp` with the following commands:

####General commands

- **`build`** - build the whole project into the destination folder `destination:home`;
- **`rebuild`** - remove the destination folder and build the project again;
- **`prebuild`** - build only _images_, _styles_ and _scripts_, but not _markup_ and _inline images_;
- **`default`** _or without command_ - build the project, launch the browser and start watching for source files changes.

####Additional commands

- **`html:build`** - parse all `twig` templates from `source:markup` folder and all inline images files while the option `image:inline` is `true`, combine them into `mainFiles:markup` file and put it into `destination:markup` folder;
- **`css:build`** - parse all `scss` files from `source:styles` folder, combine them into `mainFiles:style` file and put it into `destination:style` folder;
- **`css:clean`** - remove `scss` preprocessor's cache;
- **`js:build`** - parse all `js` files from `source:scripts`, combine them into `mainFiles:script` file and put it into `destination:script` folder;
- **`img:build`** - get all images from `source:images` folder, compress and put it into `destination:images` folder;
- **`svg:build`** - parse all `svg` files from `source:inlineImages` folder, combine them into one with `<symbol>` elements and put it into `destination:inlineImage` folder;
- **`clean`** - remove the destination folder and **all files** in it;
- **`sync`** - start the server, launch the browser and synchronize it with index file `mainFiles:markup`;
- **`watch`** - start watching for the source files changes from `source:home` folder.

##Settings
You can find all system settings with the detailed description in `config.yml` file.

##License
[MIT](https://github.com/romanVia/easy-frontend/blob/master/LICENSE)
