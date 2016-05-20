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

describe('Week feed', function() {

  var upcomingEventsTabName = 'Timetable';
  var coursesTabName = 'Courses';
  var examsTabName = 'Exams';

  var feedSelector = element.all(by.repeater('feedItem in feedItems'));

  function tabSelector() {
    return element
      .all(by.css('#week-feed'))
      .all(by.repeater('tab in tabs'));
  }

  function selectTab(tabName) {
    tabSelector().filter(function(elem) {
      return elem.getText().then(function(text) {
        return text === tabName;
      });
    }).click();
  }

  function getActiveTab() {
    return tabSelector()
      .filter(function(tab) {
        return util.hasClass(tab, 'active');
      })
      .first();
  }

  function expectActiveTab(tabName) {
    expect(getActiveTab().getText()).toEqual(tabName);
  }

  describe('week feed', function() {

    beforeEach(util.loginStudent);

    it('Will show timetable when clicking timetable tab.', function() {
      selectTab(upcomingEventsTabName);
      expectActiveTab(upcomingEventsTabName);
      expect(feedSelector.count()).toBeGreaterThan(0);
    });
    it('Will show courses when clicking courses tab.', function() {
      selectTab(coursesTabName);
      expectActiveTab(coursesTabName);
      expect(feedSelector.count()).toBeGreaterThan(0);
    });
    it('Will show exams when clicking exams tab.', function() {
      selectTab(examsTabName);
      expectActiveTab(examsTabName);
      expect(feedSelector.count()).toBeGreaterThan(0);
    });
  });
});