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

  var upcomingEventsTabName = 'Upcoming events';
  var coursesTabName = 'Courses';
  var examsTabName = 'Exams';

  var activeTabSelector = element(by.css('a.tag.tag--active'));
  var feedSelector = element.all(by.repeater('feedItem in feedItems'));

  function selectTab(tabName) {
    element(by.cssContainingText('a.tag', tabName)).click();
  }

  function expectActiveWeekFeedTab(tabName) {
    expect(activeTabSelector.getText()).toEqual(tabName);
  }

  describe('Student week feed', function() {

    beforeEach(util.loginStudent);

    it('Will show upcoming events for student when clicking upcoming events tab.', function() {
      selectTab(upcomingEventsTabName);
      expectActiveWeekFeedTab(upcomingEventsTabName);
      expect(feedSelector.count()).toBeGreaterThan(0);
    });
    it('Will show courses for student when clicking courses tab.', function() {
      selectTab(coursesTabName);
      expectActiveWeekFeedTab(coursesTabName);
      expect(feedSelector.count()).toBeGreaterThan(0);
    });
    it('Will show exams for student when clicking exams tab.', function() {
      selectTab(examsTabName);
      expectActiveWeekFeedTab(examsTabName);
      expect(feedSelector.count()).toBe(1);
    });
  });

  describe('Teacher week feed', function() {

    beforeEach(util.loginTeacher);

    it('Will show upcoming events for teacher when clicking upcoming events tab.', function() {
      selectTab(upcomingEventsTabName);
      expectActiveWeekFeedTab(upcomingEventsTabName);
      expect(feedSelector.count()).toBeGreaterThan(0);
    });
    it('Will show courses for teacher when clicking courses tab', function() {
      selectTab(coursesTabName);
      expectActiveWeekFeedTab(coursesTabName);
      expect(feedSelector.count()).toBeGreaterThan(0);
    });
    it('Will show exams for teacher when clicking exams tab', function() {
      selectTab(examsTabName);
      expectActiveWeekFeedTab(examsTabName);
      expect(feedSelector.count()).toBe(1);
    });
  });
});
