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

describe('Useful links', function() {

  var util = require('../util');

  var usefulLinksElementFinder = element.all(by.repeater('link in usefulLinks'));

  it('Will show some useful links', function() {
    util.loginStudent();
    expect(usefulLinksElementFinder.count()).toBeGreaterThan(0);
  });

  describe('Edit useful links', function() {
    var linkUrl = util.uniqueId('http://www.usefullink') + '.fi',
        linkTitle = util.uniqueId(),
        editUsefulLinksElementFinder = element(by.cssContainingText('#useful-links a.edit-link', 'edit')),
        editUsefulLinksDoneElementFinder = element(by.cssContainingText('#useful-links a.edit-link', 'done')),
        newUsefulLinkContainerElementFinder =  element(by.css('.new-useful-link-container')),
        newLinkTitleElementFinder = newUsefulLinkContainerElementFinder.element(by.css('.useful-link-title input')),
        EDITED = '_edited',
        SCROLL_OFFSET = 1200;

    function findUsefulLinkToEdit(linkTitle) {
      return usefulLinksElementFinder.filter(function(e) {
        return e.element(by.cssContainingText('a', linkTitle)).isPresent();
      }).then(function(e) {
        return e[0];
      });
    }

    beforeEach(util.loginStudent);

    it('Is possible to add useful link', function() {

      editUsefulLinksElementFinder.click();
      newUsefulLinkContainerElementFinder.element(by.model('newLink.url')).sendKeys(linkUrl);
      util.waitUntilVisible(newLinkTitleElementFinder);
      newLinkTitleElementFinder.sendKeys(linkTitle);
      newUsefulLinkContainerElementFinder.element(by.css('.new-useful-link__add-button')).click();
      editUsefulLinksDoneElementFinder.click();

      expect(element(by.cssContainingText('a', linkTitle)).isPresent()).toEqual(true);
    });

    it('Is possible to edit useful link', function() {
      util.scrollTo(SCROLL_OFFSET).then(function() {
        editUsefulLinksElementFinder.click();
        findUsefulLinkToEdit(linkTitle).then(function(e) {
          var urlInput = e.element(by.model('usefulLink.url'));
          var titleInput = e.element(by.css('.useful-link-title input'));

          e.element(by.css('span[ng-click="editUsefulLink()"]'))
            .click()
            .then(function() {
              return urlInput.sendKeys(EDITED);
            })
            .then(function() {
              return titleInput.sendKeys(EDITED);
            })
            .then(function() {
              return e.element(by.css('a .hy-done')).click();
            })
            .then(function() {
              return editUsefulLinksDoneElementFinder.click();
            })
            .then(function() {
              expect(element(by.cssContainingText('a',
                linkTitle + EDITED)).isPresent()).toEqual(true);
            });
        });
      });
    });

    it('Is possible to delete useful link', function() {
      util.scrollTo(SCROLL_OFFSET).then(function() {
        editUsefulLinksElementFinder.click();

        findUsefulLinkToEdit(linkTitle).then(function(e) {
          e.element(by.css('.hy-remove'))
            .click()
            .then(function() {
              return editUsefulLinksDoneElementFinder.click();
            })
            .then(function() {
              expect(element(by.cssContainingText('a',
                linkTitle + EDITED)).isPresent()).toEqual(false);
            });
        });
      });
    });
  });

});
