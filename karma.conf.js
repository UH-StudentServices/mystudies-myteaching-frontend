// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function (config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'src/bower_components/modernizr/modernizr.js',
            'src/bower_components/jquery/dist/jquery.js',
            'src/bower_components/angular/angular.js',
            'src/bower_components/angular-ui-router/release/angular-ui-router.js',
            'src/bower_components/angular-resource/angular-resource.js',
            'src/bower_components/angular-cookies/angular-cookies.js',
            'src/bower_components/angular-translate/angular-translate.js',
            'src/bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
            'src/bower_components/angular-dynamic-locale/src/tmhDynamicLocale.js',
            'src/bower_components/angular-local-storage/dist/angular-local-storage.js',
            'src/bower_components/angular-cache-buster/angular-cache-buster.js',
            'src/bower_components/angular-touch/angular-touch.js',
            'src/bower_components/angular-carousel/dist/angular-carousel.js',
            'src/bower_components/angular-utils-pagination/dirPagination.js',
            'src/bower_components/angular-animate/angular-animate.js',
            'src/bower_components/moment/moment.js',
            'src/bower_components/moment/locale/fi.js',
            'src/bower_components/karma-read-json/karma-read-json.js',
            'src/bower_components/angular-aria/angular-aria.js',
            'src/bower_components/lodash/lodash.js',
            'src/bower_components/angular-drag-and-drop-lists/angular-drag-and-drop-lists.js',
            'src/bower_components/nsPopover/src/nsPopover.js',
            'src/bower_components/angular-google-analytics/dist/angular-google-analytics.min.js',
            'src/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            'src/bower_components/angular-flexslider/angular-flexslider.js',
            'src/bower_components/angular-mocks/angular-mocks.js',
            'src/bower_components/zeroclipboard/dist/ZeroClipboard.js',
            'src/bower_components/angular-zeroclipboard/src/angular-zeroclipboard.js',
            'src/app/app.js',
            'src/app/services/**/*.js',
            'src/app/filters/*.js',
            'src/app/directives/**/*.js',
            'src/app/controllers/*.js',
            'src/app/resources/*.js',
            'src/app/utils/*.js',
            'test/testdata/*.json',
            'test/spec/unit/**/*.js'
        ],


        // list of files / patterns to exclude
        exclude: [],

        // web server port
        port: 9876,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS'],

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};
