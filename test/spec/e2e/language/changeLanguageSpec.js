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

var util = require('../util');

describe('Changing language', function() {
  beforeEach(util.loginStudent);

  function createTitleElementFinder(title) {
    return element(by.cssContainingText('h1', title));
  }

  function clickChangeLanguageLink(languageString) {
    util.firstVisibleElement(by.cssContainingText('menu-language a', languageString)).click();
  }

  it('Is possible to change the language to Finnish', function() {
    var titleElementFinder = createTitleElementFinder('Opintoni');

    browser.ignoreSynchronization = true;

    clickChangeLanguageLink('Suomi');
    util.waitUntilPresent(titleElementFinder).then(function() {
      browser.ignoreSynchronization = false;
    });
    expect(titleElementFinder.isPresent()).toEqual(true);
  });

  it('Is possible to change the language to Swedish', function() {
    var titleElementFinder = createTitleElementFinder('Mina studier');

    browser.ignoreSynchronization = true;

    clickChangeLanguageLink('Svenska');
    util.waitUntilPresent(titleElementFinder).then(function() {
      browser.ignoreSynchronization = false;
    });
    expect(titleElementFinder.isPresent()).toEqual(true);
  });

  afterEach(function() {
    browser.driver.manage().deleteAllCookies();
  })

});