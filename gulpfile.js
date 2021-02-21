var gulp = require("gulp");
var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");
var concat = require("gulp-concat");
var ts = require("gulp-typescript");
var uglify = require("gulp-uglify");
var browserSync = require("browser-sync").create();

var srcPaths = {
    html: "src/html/",
    scss: "src/scss/",
    ts: "src/ts/",
};

var distPaths = {
    html: "dist/html/",
    css: "dist/css/",
    js: "dist/js/",
};

gulp.task("html", function () {
    return gulp
        .src(srcPaths.html + "*.html")
        .pipe(gulp.dest(distPaths.html))
        .pipe(
            browserSync.reload({
                stream: true,
            })
        );
});

gulp.task("scss", function () {
    return gulp
        .src(srcPaths.scss + "*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(concat("styles.css"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(distPaths.css))
        .pipe(
            browserSync.reload({
                stream: true,
            })
        );
});
var tsProject = ts.createProject("tsconfig.json");
gulp.task("ts", function () {
    return gulp
        .src(srcPaths.ts + "*.ts")
        .pipe(tsProject())
        .pipe(sourcemaps.init())
        .pipe(concat("all.min.js"))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(distPaths.js))
        .pipe(
            browserSync.reload({
                stream: true,
            })
        );
});

gulp.task("browserSync", function () {
    browserSync.init({
        server: {
            baseDir: "dist/html",
        },
    });
    gulp.watch(srcPaths.html + "*.html").on("change", gulp.series("html"));
    gulp.watch(srcPaths.scss + "*.scss").on("change", gulp.series("scss"));
    gulp.watch(srcPaths.ts + "*.ts").on("change", gulp.series("ts"));
});

gulp.task(
    "default",
    gulp.series("html", "scss", "ts", "browserSync"),
    function () {}
);
