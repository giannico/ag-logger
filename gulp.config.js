'use strict';

module.exports = function() {
    var rootDir = __dirname + '/';

    var tempDir = rootDir + '.tmp/';
    var demoDir = rootDir + 'demo/';
    var srcDir = rootDir + 'src/';
    var releaseDir = rootDir + 'release/';
    var bowerComponentsDir = demoDir + 'vendor/';

    var packageJson = rootDir + 'package.json';
    var bowerJson = rootDir + 'bower.json';
    var versionJson = releaseDir + 'version.json';

    var config = {
        // directories
        rootDir: rootDir,
        tempDir: tempDir,
        demoDir: demoDir,
        srcDir: srcDir,
        releaseDir: releaseDir,
        bowerComponentsDir: bowerComponentsDir,

        packageJson: packageJson,
        bowerJson: bowerJson,
        versionJson: versionJson,

        gulpJs: [
            rootDir + 'gulpfile.js',
            rootDir + 'gulp.config.js'
        ],

        allJs: [
            demoDir + '**/*.js',
            srcDir + '**/*.js',
            '!' + bowerComponentsDir + '**/*.js'
        ],

        srcJs: [
            srcDir + '**/*.module.js',
            srcDir + '**/*.js',
            '!' + srcDir + '**/*.spec.js'
        ],

        demoServerOptions: {
            host: 'localhost',
            port: 8080,
            livereload: true,
            directoryListing: true,
            path: '/'
        },

        get demoUrl () {
            return 'http://' + this.demoServerOptions.host + ':' + this.demoServerOptions.port + '/demo/index.html';
        }
    };

    return config;
};
