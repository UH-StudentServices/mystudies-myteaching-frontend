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

describe('RSS feed favorite', function() {

  var util = require('../util');
  var feedUrl = 'http://www.helsinki.fi';

  var favoritesListElementFinder = element.all(by.repeater('favorite in favorites'));
  var addNewFavoriteButtonElementFinder = element(by.css('a.add-favorite-button'));
  var selectRSSFavoriteTypeElementFinder = element(
    by.cssContainingText('.add-favorite-container a', 'RSS feed'));
  var searchRSSFeedElementFinder = element(by.css('.add-favorite-container'))
    .element(by.model('searchString'));
  var editButtonFinder = element(by.css('#favorites .edit-link'));
  var removeButtonFinder = element.all(by.css('#favorites .favorites-list__remove'));
  var searchResultsFinder = element
    .all(by.repeater('result in searchResults'));
  var firstSearchResultFinder = searchResultsFinder
    .first()
    .element(by.css('a'));

  beforeEach(util.loginStudent);

  it('Is possible to add an RSS feed', function() {
    favoritesListElementFinder.count().then(function(count) {
      util.scrollTo(2500).then(function() {
        addNewFavoriteButtonElementFinder.click();
        selectRSSFavoriteTypeElementFinder.click();
        searchRSSFeedElementFinder.sendKeys(feedUrl);
        util.waitUntilPresent(searchResultsFinder);
        firstSearchResultFinder.click();
        expect(favoritesListElementFinder.count()).toEqual(count + 1);
      });
    });
  });

  it('Is posssible to remove an RSS feed', function() {
    favoritesListElementFinder.count().then(function(count) {
      util.scrollTo(1200).then(function() {
        editButtonFinder.click();
        util.waitUntilPresent(removeButtonFinder);
        removeButtonFinder.first().click();
        expect(favoritesListElementFinder.count()).toEqual(count - 1);
      });
    });
  });
});
