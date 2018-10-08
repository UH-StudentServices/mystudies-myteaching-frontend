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

module.exports = function (config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      '../bower_components/angular/angular.js',
      '../bower_components/angular-resource/angular-resource.js',
      '../bower_components/angular-mocks/angular-mocks.js',
      '../bower_components/lodash/lodash.js',
      '../bower_components/moment/moment.js',
      '../bower_components/rxjs/dist/rx.js',
      '../bower_components/rxjs/dist/rx.binding.js',
      '../bower_components/angular-sanitize/angular-sanitize.js',
      '../bower_components/angular-ellipsis/src/angular-ellipsis.js',
      '../bower_components/angular-ui-utils/ui-utils.js',
      'src/app/**/*.js',
      '../common/src/app/**/!(bootstrap).js',
      'test/spec/unit/**/*.js',
      '../common/test/mock/language.service.mock.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 9875,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

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
