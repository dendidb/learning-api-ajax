/* Gulp Core
--------------------------------------------------- */
import { series, parallel, src, dest, watch } from "gulp";

/* Plugins
--------------------------------------------------- */
// colors
import c from "ansi-colors";

// server
import browserSync from "browser-sync";

// error handling
import notify from "gulp-notify";
import errorHandle from "gulp-error-handle";

// pug
import pug from "gulp-pug";
import htmlBeautify from "gulp-html-beautify";

// style
// sass v4
// import sass from "gulp-sass";
// sass v5
const sass = require('gulp-sass')(require('sass'));
import postcss from "gulp-postcss";
import postcssScss from "postcss-scss";
import autoprefixer from "autoprefixer";

// optimize style
import stripCssComments from "gulp-strip-css-comments";
import combineMq from "postcss-combine-media-query";
import cleanCSS from "gulp-clean-css";

// js
import babelify from "babelify";
import browserify from "browserify";
import source from "vinyl-source-stream";
import buffer from "vinyl-buffer";
import concat from "gulp-concat";

// optimize js
import uglify from "gulp-uglify";

// optimize image
import imagemin from "gulp-imagemin";
import imageminPngquant from "imagemin-pngquant";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminGiflossy from "imagemin-giflossy";

// other
import rename from "gulp-rename";
import sourcemaps from "gulp-sourcemaps";
import changed from "gulp-changed";
import del from "del";

// custom project
import deleteFile from "gulp-delete-file";
import multiDest from "gulp-multi-dest";

/* ------------------------------------------------------------------------------
@name: Config Directory
@description: Config Directory for SRC (development) and BUILD (production)
--------------------------------------------------------------------------------- */
// root
const SRC = "src";
const BUILD = "dist";
const fileName = 'app';

const optionsHTML = {
  indent_size: 2,
  indent_char: ' ',
  eol: '\n',
  end_with_newline: true
};

// dev
const DEV_PATH = {
  view: {
    watch: `${SRC}/pug/**/*.pug`,
    pages: `${SRC}/pug/pages/*.pug`,
  },
  style: `${SRC}/scss/**/*.scss`,
  script: {
    vendor: {
      order: [
        `${SRC}/scripts/vendors/jquery-3.6.0.min.js`,
        `${SRC}/scripts/vendors/owl.carousel.min.js`,
        `${SRC}/scripts/vendors/*.js`
      ],
      concat: 'vendor.js'
    },
    watch: `${SRC}/scripts/**/*.js`,
    main: `${SRC}/scripts/${fileName}.js`
  },
  image: `${SRC}/images/**/*`,
  fonts: `${SRC}/fonts/*`,
  others: {
    forbidden: `${SRC}/others/html/403.html`,
    data: `${SRC}/others/data/*.json`
  }
};

// build
const BUILD_PATH = {
  view: `${BUILD}`,
  style: {
    dir: `${BUILD}/assets/css`,
    main: `${BUILD}/assets/css/${fileName}.min.css`
  },
  script: {
    dir: `${BUILD}/assets/js`,
    main: `${BUILD}/assets/js/${fileName}.min.js`
  },
  image: `${BUILD}/assets/img`,
  fonts: `${BUILD}/assets/fonts`,
  maps: [
    `${BUILD}/assets/css/maps`,
    `${BUILD}/assets/js/maps`
  ],
  readMe: `${BUILD}/assets/**/**/*.md`,
  others: {
    forbidden: [
      `${BUILD}/assets/`,
      `${BUILD}/assets/audio`,
      `${BUILD}/assets/css`,
      `${BUILD}/assets/fonts`,
      `${BUILD}/assets/img`,
      `${BUILD}/assets/img/bg`,
      `${BUILD}/assets/img/dummy`,
      `${BUILD}/assets/img/homescreen`,
      `${BUILD}/assets/img/logo`,
      `${BUILD}/assets/js`,
      `${BUILD}/assets/js/data`,
    ],
    data: `${BUILD}/assets/js/data`
  }
};

// colors
const COLORS = {
  error: 'red',
  success: 'green',
  build: {
    name: 'magenta',
    size: 'cyan'
  }
};

// renameOptions
const renameOptions = {
  suffix: '.min'
};

/* ------------------------------------------------------------------------------
@name: cleanBuild
@description delete build folder
--------------------------------------------------------------------------------- */
export const cleanBuild = () => {
  return del(BUILD, {
    force: true
  }).then(() => {
    console.log(c[COLORS.success].bold('--------- Build cleaned! ---------'));
  });
};


/* ------------------------------------------------------------------------------
@name: cleanMaps
@description delete maps directory
--------------------------------------------------------------------------------- */
export const cleanMaps = () => {
  return del(BUILD_PATH.maps, {
    force: true
  }).then(() => {
    console.log(c[COLORS.success].bold('--------- Maps cleaned! ---------'));
  });
};


/* ------------------------------------------------------------------------------
@name: cleanMd
@description delete md files
--------------------------------------------------------------------------------- */
export const cleanMd = () => {
  return src(BUILD_PATH.readMe)
    .pipe(deleteFile({
      reg: '/([/|.|\w|\s|-])*\.(?:md)/g',
      deleteMatch: false
    }))
    .on('end', () => {
      console.log(c[COLORS.success].bold('--------- Md Files cleaned! ---------'));
    });
};


/* ------------------------------------------------------------------------------
@name: Clean Temporary Task
@description: Clean maps directory and md files
--------------------------------------------------------------------------------- */
export const cleanTemporary = parallel(cleanMaps, cleanMd);

/* ------------------------------------------------------------------------------
@name: Server
@description: Config Server, Reload and devServer browserSync
--------------------------------------------------------------------------------- */
const server = browserSync.create();

export const reload = done => {
  server.reload();
  done();
};

export const devServer = done => {
  server.init({
    ghostMode: true,
    notify: false,
    server: {
      baseDir: BUILD_PATH.view,
    },
    open: true
  });
  done();
};


/* ------------------------------------------------------------------------------
@name: CompilePug
@description: Compiles Pug files to HTML
--------------------------------------------------------------------------------- */
export const compilePug = () => {
  return src(DEV_PATH.view.pages)
    .pipe(pug())
    .on("error", notify.onError(
      (err) => {
        return '\nProblem file : ' + c[COLORS.error].bold(err.message, err.path);
      }
    ))
    .pipe(htmlBeautify(optionsHTML))
    .pipe(dest(BUILD_PATH.view))
    .pipe(server.stream())
    .on('end', () => {
      console.log(c[COLORS.success].bold('--------- Pug finished compiling! ---------'));
    });
};

/* ------------------------------------------------------------------------------
@name: compileStyle
@description: Compiles Pug files to HTML
--------------------------------------------------------------------------------- */
export const compileStyle = () => {
  return src(DEV_PATH.style)
    .pipe(errorHandle())
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", notify.onError(
      (err) => {
        return '\nProblem file : ' + c[COLORS.error].bold(err.message, err.path);
      }
    )))
    .pipe(postcss([autoprefixer()], {
      syntax: postcssScss
    }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(dest(BUILD_PATH.style.dir))
    .pipe(rename(renameOptions))
    .pipe(dest(BUILD_PATH.style.dir))
    .pipe(server.stream())
    .on('end', () => {
      console.log(c[COLORS.success].bold('--------- Style finished compiling! ---------'));
    });
};


/* ------------------------------------------------------------------------------
@name: compileJS
@description: Compiles ES6 files to ES5 (javascripts)
--------------------------------------------------------------------------------- */
const bundle = bundler => {
  return bundler
    .transform(babelify, {
      presets: ["@babel/preset-env"]
    })
    .bundle()
    .on("error", notify.onError(
      (err) => {
        return '\nProblem file : ' + c[COLORS.error].bold(err.message, err.path);
      }
    ))
    .pipe(source(`${fileName}.js`))
    .pipe(buffer())
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
    .pipe(sourcemaps.write("./maps"))
    .pipe(dest(BUILD_PATH.script.dir))
    .pipe(rename(renameOptions))
    .pipe(dest(BUILD_PATH.script.dir))
    .on('end', (done) => {
      console.log(c[COLORS.success].bold('--------- JS finished compiling! ---------'));
    });
};

export const compileJS = () => {
  return bundle(browserify(DEV_PATH.script.main, {
    debug: true
  }));
};


/* ------------------------------------------------------------------------------
@name: compressImage
@description: Optimize image
--------------------------------------------------------------------------------- */
export const compressImage = () => {
  return src(DEV_PATH.image)
    .pipe(changed(BUILD_PATH.image))
    .pipe(imagemin([
      // jpg
      imageminMozjpeg({
        quality: 76.75
      }),
      // png
      imageminPngquant({
        speed: 1,
        quality: [0.225, 0.425]
      }),
      // svg
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false },
          { removeUnknownsAndDefaults: false }
        ]
      }),
      // gif
      imageminGiflossy({
        optimizationLevel: 3,
        optimize: 3,
        lossy: 2
      })
    ]))
    .pipe(dest(BUILD_PATH.image))
    .pipe(server.stream())
    .on('end', () => {
      console.log(c[COLORS.success].bold('--------- Image finished compressing! ---------'));
    });
};

/* ------------------------------------------------------------------------------
@name: copyVendorJS
@description: Copy files to production directory
--------------------------------------------------------------------------------- */
export const copyVendorJS = () => {
  return src(DEV_PATH.script.vendor.order)
    .pipe(concat(DEV_PATH.script.vendor.concat))
    .pipe(dest(BUILD_PATH.script.dir))
    .pipe(rename(renameOptions))
    .pipe(uglify({
      mangle: false
    }))
    .pipe(dest(BUILD_PATH.script.dir))
    .pipe(server.stream())
    .on('end', () => {
      console.log(c[COLORS.success].bold('--------- Vendor JS finished copying! ---------'));
    });
};


/* ------------------------------------------------------------------------------
@name: copyFonts
@description: Copy files to production directory
--------------------------------------------------------------------------------- */
export const copyFonts = () => {
  return src(DEV_PATH.fonts)
    .pipe(changed(BUILD_PATH.fonts))
    .pipe(dest(BUILD_PATH.fonts))
    .pipe(server.stream())
    .on('end', () => {
      console.log(c[COLORS.success].bold('--------- Fonts finished copying! ---------'));
    });
};

/* ------------------------------------------------------------------------------
@name: copyOthers
@description: Copy files to production directory
--------------------------------------------------------------------------------- */
export const copyData = () => {
  return src(DEV_PATH.others.data)
    .pipe(dest(BUILD_PATH.others.data))
    .on('end', () => {
      console.log(c[COLORS.success].bold('--------- Data finished copying! ---------'));
    });
};

export const copyForbidden = () => {
  return src(DEV_PATH.others.forbidden)
    .pipe(rename('index.html'))
    .pipe(multiDest(BUILD_PATH.others.forbidden))
    .on('end', () => {
      console.log(c[COLORS.success].bold('--------- Forbidden finished copying! ---------'));
    });
};

export const copyOthers = parallel(
  copyData,
  copyForbidden
);


/* ------------------------------------------------------------------------------
@name: Task Watch
@description: Watches for changes to files
--------------------------------------------------------------------------------- */
export const devWatch = (done) => {
  // Shows that run "watch" mode
  global.watch = true;

  // PUG
  watch(DEV_PATH.view.watch, compilePug);

  // SCSS
  watch(DEV_PATH.style, series(compileStyle));

  // JS
  watch(DEV_PATH.script.watch, series(compileJS, reload));

  // Image
  watch(DEV_PATH.image, compressImage);

  // Fonts
  watch(DEV_PATH.fonts, copyFonts);

  return done();

};

/* ------------------------------------------------------------------------------
@name: Default Task
@description: Default Task will be run at run gulp
--------------------------------------------------------------------------------- */
exports.default = series(
  compressImage,
  parallel(cleanMd, copyFonts),
  parallel(cleanMd, copyVendorJS, copyFonts),
  parallel(compileStyle, compileJS),
  copyOthers,
  compilePug,
  devServer,
  devWatch
);

/* ------------------------------------------------------------------------------
@name: optimizeStyle
@description: Optimize style
--------------------------------------------------------------------------------- */
export const optimizeStyle = () => {
  return src(BUILD_PATH.style.main)
    .pipe(postcss([combineMq], {
      syntax: postcssScss
    }))
    .pipe(stripCssComments({
      preserve: false
    }))
    .pipe(cleanCSS({
      debug: true
    }, (details) => {
      console.log(
        c[COLORS.success].bold('--------- Original Size ') +
        c[COLORS.build.name].bold(`(${details.name}) `) +
        c[COLORS.build.size].bold(details.stats.originalSize) +
        c[COLORS.success].bold(' ---------')
      );
      console.log(
        c[COLORS.success].bold('--------- Minified Size ') +
        c[COLORS.build.name].bold(`(${details.name}) `) +
        c[COLORS.build.size].bold(details.stats.minifiedSize) +
        c[COLORS.success].bold(' ---------')
      );
    }))
    .pipe(dest(BUILD_PATH.style.dir))
    .on('end', () => {
      console.log(c[COLORS.success].bold('--------- Style finished optimizing! ---------'));
    });
};

/* ------------------------------------------------------------------------------
@name: optimizeJS
@description: Optimize JS
--------------------------------------------------------------------------------- */
export const optimizeJS = () => {
  return src(BUILD_PATH.script.main)
    .pipe(uglify({
      mangle: false
    }))
    .pipe(dest(BUILD_PATH.script.dir))
    .on('end', () => {
      console.log(c[COLORS.success].bold('--------- JS finished optimizing! ---------'));
    });
};


/* ------------------------------------------------------------------------------
@name: Build Task
@description: Build Task will be run at run gulp
--------------------------------------------------------------------------------- */
exports.build = series(
  cleanBuild,
  compressImage,
  parallel(copyVendorJS, copyFonts),
  parallel(
    series(compileStyle, optimizeStyle),
    series(compileJS, optimizeJS)
  ),
  copyOthers,
  compilePug,
  cleanTemporary
);
