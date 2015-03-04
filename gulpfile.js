"use strict";

var buffer = require("vinyl-buffer");
var browserify = require("browserify");
var gulp = require("gulp");
var minifycss = require("gulp-minify-css");
var source = require("vinyl-source-stream");
var sourcemaps = require("gulp-sourcemaps");
var uglify = require("gulp-uglify");
var usemin = require("gulp-usemin");
var watchify = require("watchify");
var watch = require("gulp-watch");

var copy_list = [
    "./manifest.json",
    "./images/icon_*.png"
];

var js_tasks = {
    "js/browser-action": {
        source: "./browser-action.jsx",
        basedir: "./js",
        output: "./js/browser-action.js"
    }
};

var htmlcss_tasks = {
    "html+css/browser-action": {
        source: "./browser-action.html"
    }
};

var htmlcss_watchlist = [
    "./**/*.html",
    "./css/**/*",
    "!./build/**/*",
];

gulp.task("default", [ "js", "html+css", "copy", "watch" ], function () {});

// js bundle task
gulp.task("js", Object.keys(js_tasks));
for (var task_name in js_tasks) {
    gulp.task(task_name, bundle(task_name));
}

// html usemin task
gulp.task("html+css", Object.keys(htmlcss_tasks));
for (var task_name in htmlcss_tasks) {
    gulp.task(task_name, html_bundle(task_name));
}

gulp.task("copy", function () {
    gulp.src(copy_list, { base: "./" })
        .pipe(gulp.dest("./build"));
    gulp.src("./bower_components/semantic-ui/dist/themes/**/*", {
        base: "./bower_components/semantic-ui/dist"
    }).pipe(gulp.dest("./build/css"));
});

// watcher
gulp.task("watch", function () {
    watch(copy_list, function () {
        gulp.start("copy");
    });
    watch(htmlcss_watchlist, function () {
        gulp.start("html+css");
    });
});

function bundle(task_name) {
    var task_def = js_tasks[task_name];
    var bundler = watchify(browserify(task_def.source, {
        basedir: task_def.basedir,
        cache: {},
        debug: true,
        fullPaths: true,
        packageCache: {}
    }));

    bundler.on("update", function () {
        gulp.start(task_name);
    });

    return function() {
        return bundler.bundle()
            .pipe(source(task_def.output))
            .pipe(buffer())
            /*
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(uglify())
            .pipe(sourcemaps.write("./"))
            */
            .pipe(gulp.dest("./build"));
    };
}

function html_bundle(task_name) {
    var task_def = htmlcss_tasks[task_name];

    return function () {
        return gulp.src(task_def.source)
            .pipe(usemin({
                assetsDir: "./",
                css: [ minifycss(), "concat" ]
            }))
            .pipe(gulp.dest("./build"));
    };
}
