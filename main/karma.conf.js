/*
 * This file is part of MystudiesMyteaching application.
 *
 * MystudiesMyteaching application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * MystudiesMyteaching application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with MystudiesMyteaching application.  If not, see <http://www.gnu.org/licenses/>.
 */

// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      '../bower_components/jquery/dist/jquery.js',
      '../bower_components/angular/angular.js',
      '../bower_components/angular-ui-router/release/angular-ui-router.js',
      '../bower_components/angular-resource/angular-resource.js',
      '../bower_components/angular-cookies/angular-cookies.js',
      '../bower_components/angular-translate/angular-translate.js',
      '../bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
      '../bower_components/angular-local-storage/dist/angular-local-storage.js',
      '../bower_components/angular-touch/angular-touch.js',
      '../bower_components/angular-animate/angular-animate.js',
      '../bower_components/moment/moment.js',
      '../bower_components/moment/locale/fi.js',
      '../bower_components/karma-read-json/karma-read-json.js',
      '../bower_components/angular-aria/angular-aria.js',
      '../bower_components/lodash/lodash.js',
      '../bower_components/angular-drag-and-drop-lists/angular-drag-and-drop-lists.js',
      '../bower_components/angular-google-analytics/dist/angular-google-analytics.min.js',
      '../bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      '../bower_components/angular-flexslider/angular-flexslider.js',
      '../bower_components/angular-mocks/angular-mocks.js',
      '../bower_components/angular-block-ui/dist/angular-block-ui.min.js',
      '../bower_components/angular-click-outside/clickoutside.directive.js',
      '../bower_components/rxjs/dist/rx.all.js',
      '../bower_components/rxjs/dist/rx.binding.js',
      '../bower_components/angular-sanitize/angular-sanitize.js',
      '../bower_components/ng-joyride/ng-joyride.js',
      '../bower_components/angular-ui-utils/ui-utils.js',
      '../bower_components/angular-ellipsis/src/angular-ellipsis.js',
      '../bower_components/ng-file-upload/ng-file-upload.js',
      '../bower_components/angular-ui-calendar/src/calendar.js',
      '../bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
      '../bower_components/angular-mocks/angular-mocks.js',
      '../bower_components/angular-google-analytics/dist/angular-google-analytics.min.js',
      'src/app/errors/errors.js',
      'src/app/dialog/dialog.js',
      'src/app/lander/lander.js',
      'src/app/vendor/ng-addToHomescreen/ng-addToHomescreen.js',
      'src/app/app.js',
      'src/app/analytics/*.js',
      'src/app/constants/*.js',
      'src/app/services/**/*.js',
      'src/app/filters/*.js',
      'src/app/directives/**/*.js',
      'src/app/controllers/*.js',
      'src/app/resources/*.js',
      'src/app/utils/*.js',
      '../common/src/app/**/!(bootstrap).js',
      'test/testdata/*.json',
      'test/spec/unit/**/*.js'
    ],


    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 9876,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
//    logLevel: config.LOG_INFO,
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
