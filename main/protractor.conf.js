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

var ScreenShotReporter = require('protractor-screenshot-reporter');

exports.config = {
  specs: ['test/spec/e2e/**/*.js'],

  capabilities: {
    'browserName': 'phantomjs',
    'chromeOptions': {
      'args': ['--start-maximized']
    },
    'phantomjs.cli.args': ['--web-security=false', '--ignore-ssl-errors=true'],
    'phantomjs.binary.path': '../node_modules/.bin/phantomjs'
  },

  onPrepare: function() {
    // Add a screenshot reporter and store screenshots to `/tmp/screnshots`:
    jasmine.getEnv().addReporter(new ScreenShotReporter({
      baseDirectory: 'e2e_screenshots',
      takeScreenShotsOnlyForFailedSpecs: true
    }));

    browser.driver.manage().window().setSize(2000, 1500);
  }
};
