const gulp = require("gulp"); // mówi nodeowi aby zajrzał do node_modulses i szukał gulpa; importujemy paczkę
const sass = require("gulp-sass");
const sourcemaps = require('gulp-sourcemaps');  //skompresowany plik css nie jest praktycznie mozliwy do debugowania, sourcemapy pozwola wskazac miejsce bledu 
const autoprefixer = require('gulp-autoprefixer'); //prefksy dla róznych przegladarek. w package.json definiujemy dla jakich przegladarek chcemy tworzyc prefiksy
const browserSync = require('browser-sync').create(); // automatyczne odświeżanie strony po wykryciu zmian
const colors        = require("ansi-colors"); // kolor bledu
const notifier      = require("node-notifier"); //notyfikacja bledu w rogu ekranu


const showError = function(err) {
     notifier.notify({
        title: "Error in sass",
        message: err.messageFormatted
    });
    
    console.log(colors.red("==============================="));
    console.log(colors.red(err.messageFormatted));
    console.log(colors.red("==============================="));
    
}

const server = function(cb) {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        notify: false, //reszta opcji z dokumentacji browsersync
        //host: "192.168.0.24",
        //port: 3000,
        open: true,
        //browser: "google chrome" //https://stackoverflow.com/questions/24686585/gulp-browser-sync-open-chrome-only
    });

    cb();
}

const css = function() {
    return gulp.src("scss/**/*.scss")
    .pipe(sourcemaps.init()) 
    .pipe(
        sass({
            outputStyle : "compressed" //styl kodu - extended, nested, copressed, compact - i tak chcemy compressed
        }).on("error", showError)
    )
    .pipe(autoprefixer()) //autoprefixy https://github.com/browserslist/browserslist#queries
    .pipe(sourcemaps.write(".")) //po modyfikacjach na plikach zapisujemy w pamieci sourcemap
    .pipe(gulp.dest("css"))
    .pipe(browserSync.stream({match: "**/*.css"}));
}

const watch = function() {  //działa w tle obserwując zmiany na plikach, gdy je wykryje odpali odpowiednie wczesniej zdefiniowane taski
    gulp.watch("scss/**/*.scss", gulp.series(css)); //przy dluzszej pracy gulpa kompliacja trwa dluzej, usePolling - uzywamy aby nie pojawial sie ten problem
    gulp.watch("*.html").on('change', browserSync.reload);
}

exports.default = gulp.series(css, server, watch);
exports.css = css;
exports.watch = watch; 