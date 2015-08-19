'use strict';

var gulp = require('gulp');
var config = require('./gulp.config')();
var packageObj = require(config.packageJson);
var $ = require('gulp-load-plugins')({ lazy: true });

var args = require('yargs').argv;
var fs = require('fs');
var open = require('open');
var del = require('del');

var options = {
    verbose: args.verbose
};

//////////////////////////////////////////////////
/// Tasks
//////////////////////////////////////////////////

////////////////////
/// stage-release
////////////////////

var stageReleaseTask = gulp.series(
    cleanReleaseDir,
    gulp.parallel(createReleaseJs, createOptimizedReleaseJs),
    createVersionJson
);

stageReleaseTask.description = 'Stages a new release of the application.';

gulp.task('stage-release', stageReleaseTask);

////////////////////
/// release
////////////////////

var releaseTask = gulp.series(
    lintJs,
    bumpVersion,
    stageReleaseTask
);

releaseTask.description = 'Stages a new release of the application.';

gulp.task('release', releaseTask);

////////////////////
/// demo
////////////////////

var demoTask = gulp.series(
    startDemoServer
);

demoTask.description = 'Starts the demo server.';

gulp.task('demo', demoTask);

////////////////////
/// dev
////////////////////

var devTask = gulp.series(
    stageReleaseTask,
    demoTask,
    watchSrcJs
);

devTask.description = 'Starts the dev server.';

gulp.task('dev', devTask);

////////////////////
/// lint-js
////////////////////

var jsLintTask = gulp.series(
    lintJs
);

jsLintTask.description = 'Runs JSHint on all JavaScript source files.';

gulp.task('lint-js', jsLintTask);

//////////////////////////////////////////////////
/// Implementation
//////////////////////////////////////////////////

////////////////////////////////////////
/// Cleaning
////////////////////////////////////////

function cleanReleaseDir(done) {
    log('Cleaning release directory.');

    clean(config.releaseDir, done);
}

////////////////////////////////////////
/// Linting
////////////////////////////////////////

function lintJs() {
    log ('Linting JS');

    return gulp.src(config.allJs).
            pipe($.if(options.verbose, $.print())).
            pipe($.jshint()).
            pipe($.jshint.reporter('jshint-stylish', { verbose: true })).
            pipe($.jshint.reporter('fail'));
}

////////////////////////////////////////
/// Bump
////////////////////////////////////////

/**
 * Bump the version
 * --type=pre will bump the prerelease version *.*.*-x
 * --type=patch or no flag will bump the patch version *.*.x
 * --type=minor will bump the minor version *.x.*
 * --type=major will bump the major version x.*.*
 * --to=1.2.3 will bump to a specific version and ignore other flags
 */
function bumpVersion() {
    log('Bumping project version.');
    log('Current version: ' + packageObj.version);

    var type = args.type;
    var version = args.to;

    if (version == null && type == null) {
        throw new Error('A new bump version or type must be specified.');
    }

    var bumpMessage = null;

    var options = {};

    if (version) {
        options.version = version;
        bumpMessage = 'Bumping to version: ' + version;
    } else {
        options.type = type;
        bumpMessage = 'Bumping type: ' + type;
    }

    log(bumpMessage);

    return gulp.src(config.packageJson).
            pipe($.print()).
            pipe($.bump(options)).
            pipe(gulp.dest(config.rootDir));
}

function createVersionJson(done) {
    log('Creating version.json.');

    var output = {
        version: packageObj.version
    };

    fs.writeFile(config.versionJson, JSON.stringify(output, null, 4), done);
}

////////////////////////////////////////
/// Optimization
////////////////////////////////////////

function createReleaseJs() {
    log('Creating release js.');

    return gulp.
            src(config.srcJs).
            // pipe($.ngAnnotate()).
            pipe($.concat(packageObj.name + '.js')).
            pipe(gulp.dest(config.releaseDir));
}

function createOptimizedReleaseJs() {
    log('Creating optimized release js.');

    return gulp.
            src(config.srcJs).
            pipe($.concat(packageObj.name + '.min.js')).
            pipe($.uglify()).
            pipe(gulp.dest(config.releaseDir));
}

////////////////////////////////////////
/// Demo Server
////////////////////////////////////////

function startDemoServer(done) {
    log('Starting demo server.');
    gulp.src(config.rootDir).
        pipe($.webserver(config.demoServerOptions));

    log('Opening demo: ' + config.demoUrl + '.');
    open(config.demoUrl);

    done();
}

////////////////////////////////////////
/// Watchers
////////////////////////////////////////

function watchSrcJs() {
    log('Watching src files.');

    $.watch(config.srcJs, function(vinyl) {
        logChangeEvent(vinyl);
        stageReleaseTask();
    });
}

////////////////////////////////////////
/// Helper functions
////////////////////////////////////////

function logChangeEvent(vinyl) {
    log('File ' + vinyl.event + ' ' + vinyl.path.replace(config.rootDir, ''));
}

function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path) + '.');
    del(path, done);
}

function log(message) {
    if (typeof(message) === 'object') {
        _logObject(message);
    } else {
        _logMessage(message);
    }
}

function _logMessage(message) {
    $.util.log($.util.colors.blue(message));
}

function _logObject(obj) {
    for (var item in obj) {
        if (obj.hasOwnProperty(item)) {
            _logMessage(obj[item]);
        }
    }
}