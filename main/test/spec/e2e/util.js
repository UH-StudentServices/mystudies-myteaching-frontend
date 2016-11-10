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

var uuid = require('node-uuid'),
    _ = require('lodash'),
    DELAY = 10000;

function login(role, username, password, siteName) {
  var userNameInputLocator = by.css('input[name="username"]'),
      passwordInputLocator = by.css('input[name="password"]'),
      submitInputLocator = by.css('input[type="submit"]'),
      loginLinkLocator = by.css('.login-page__login-link'),
      loginUrl = browser.params[role].loginUrl;

  browser.driver.get(loginUrl);

  element(loginLinkLocator).isPresent().then(function(isPresent) {
    if (isPresent) {
      element(loginLinkLocator).click();
    }
  });

  browser.wait(function() {
    return element(userNameInputLocator).isPresent();
  }, 2 * DELAY);

  element(userNameInputLocator).sendKeys(username);
  element(passwordInputLocator).sendKeys(password);
  element(submitInputLocator).click();

  browser.wait(function() {
    return element(by.cssContainingText('h1', siteName)).isPresent();
  }, DELAY).then(function() {
    dismissTour();
  });
}

function dismissTour() {
  var dismisButtonFinder = element(by.css('.ng-joyride-title .skipBtn'));

  return dismisButtonFinder.isPresent().then(function(isPresent) {
    if (isPresent) {
      dismisButtonFinder.click();
    }
  });
}

function waitUntilPresent(elementFinder) {
  var predicateFunction;

  if (typeof elementFinder.count === 'function') {
    predicateFunction = function() {
      return elementFinder.count().then(function(count) {
        return count > 0;
      });
    };
  } else {
    predicateFunction = function() {
      return elementFinder.isPresent();
    };
  }
  return browser.wait(predicateFunction, DELAY);
}

function waitUntilNotPresent(elementFinder) {
  var predicateFunction;

  if (typeof elementFinder.count === 'function') {
    predicateFunction = function() {
      return elementFinder.count().then(function(count) {
        return count === 0;
      });
    };
  } else {
    predicateFunction = function() {
      return elementFinder.isPresent().then(function(present) {
        return present === false;
      });
    };
  }

  return browser.wait(predicateFunction, DELAY);
}

function waitUntilVisible(elementFinder) {
  var predicateFunction;

  if (typeof elementFinder.count === 'function') {
    predicateFunction = function() {
      return elementFinder.filter(function(e) {
        return e.isDisplayed();
      }).count().then(function(count) {
        return count > 0;
      });
    };
  } else {
    predicateFunction = function() {
      return elementFinder.isDisplayed();
    };
  }

  return browser.wait(predicateFunction, DELAY);
}

function uniqueId(str) {
  var id = uuid.v4().substr(0, 8);

  return str ? str + id : id;
}

function firstVisibleElement(locator) {
  return element.all(locator).filter(function(e) {
    return e.isDisplayed();
  }).first();
}

function scrollTo(scrollPos) {
  return browser.executeScript('window.scrollTo(0,' + scrollPos + ');');
}

module.exports = {
  login: login,
  loginStudent: _.partial(login, 'student', 'opiskelija', 'password', 'My studies'),
  loginTeacher: _.partial(login, 'teacher', 'testteacher', 'password', 'My teaching'),
  waitUntilPresent: waitUntilPresent,
  waitUntilNotPresent: waitUntilNotPresent,
  waitUntilVisible: waitUntilVisible,
  uniqueId: uniqueId,
  firstVisibleElement: firstVisibleElement,
  scrollTo: scrollTo
};
