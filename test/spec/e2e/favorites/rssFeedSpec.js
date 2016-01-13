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

/* describe('RSS feed favorite', function(){

  var util = require('../util');
  var feedUrl = 'http://yle.fi/urheilu/rss/luetuimmat.rss';

  var addNewFavoriteButtonElementFinder = element(by.css('a.add-favorite-button'));
  var feedElementFinder = element(by.css('section.rss-feed[data-feed-url="'+ feedUrl + '"] '));
  var removeButtonFinder = feedElementFinder.element(by.css('a.favorites-list__remove'));
  var resultsFinder = element.all(by.repeater('result in searchResults'));

  beforeEach(function() {
    util.loginStudent();
    //Clean up any leftover feeds
    var removeButtonsSelector = element.all(by.css('a.favorites-list__remove'));
    removeButtonsSelector.each(function(e) {
      e.click();
    });
    util.waitUntilNotPresent(removeButtonsSelector);
  });

  it('Is possible to add an RSS feed as favorite and remove it', function(){

    addNewFavoriteButtonElementFinder.click();

    element(by.cssContainingText('a', 'RSS feed')).click();

    element(by.model('searchString')).sendKeys(feedUrl);

    util.waitUntilPresent(resultsFinder);

    resultsFinder.first().element(by.css('a')).click();

    util.waitUntilPresent(feedElementFinder);

    expect(feedElementFinder.isPresent()).toEqual(true);

    util.waitUntilPresent(removeButtonFinder);

    removeButtonFinder.click();

    util.waitUntilNotPresent(feedElementFinder);

    expect(feedElementFinder.isPresent()).toEqual(false);

  })


});*/