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

'use strict';

describe('FeedMessages', function () {
  var MessageTypes;
  var FeedMessages;
  var WeekFeedMessageKeys;
  var eventsTab;
  var eventsSubTab;
  var coursesTab;
  var coursesSubTab;
  var calendarSubTab;
  var testEvent = {};
  var testCourse = {};

  beforeEach(module('directives.weekFeed'));
  beforeEach(module('ngResource'));
  beforeEach(function () {
    module(function ($provide) {
      $provide.constant('StateService', { getStateFromDomain: function () { } });
    });
  });

  function expectedErrorMessage(selectedTab) {
    return {
      messageType: MessageTypes.ERROR,
      key: WeekFeedMessageKeys[selectedTab].error
    };
  }

  function expectedInfoMessage(selectedTab, selectedSubTab) {
    return {
      messageType: MessageTypes.INFO,
      key: WeekFeedMessageKeys[selectedTab].info[selectedSubTab]
    };
  }

  function expectedEmptyMessage() {}

  beforeEach(inject(function (_FeedMessages_, _MessageTypes_, _WeekFeedMessageKeys_, Tabs) {
    FeedMessages = _FeedMessages_;
    MessageTypes = _MessageTypes_;
    WeekFeedMessageKeys = _WeekFeedMessageKeys_;
    eventsTab = Tabs.SCHEDULE.key;
    eventsSubTab = Tabs.SCHEDULE.subTabs.SCHEDULE_LIST.key;
    coursesTab = Tabs.COURSES.key;
    coursesSubTab = Tabs.COURSES.subTabs.UPCOMING_COURSES.key;
    calendarSubTab = Tabs.SCHEDULE.subTabs.CALENDAR_WEEK.key;
  }));

  it('getEventsMessage will return error message if events cannot be fetched', function () {
    expect(FeedMessages.getEventsMessage(
      [],
      null,
      [],
      eventsTab,
      eventsSubTab
    ))
      .toEqual(expectedErrorMessage(eventsTab));
  });

  it('getEventsMessage will return info message if events are filtered to empty array', function () {
    expect(FeedMessages.getEventsMessage(
      [],
      [],
      [],
      eventsTab,
      eventsSubTab
    ))
      .toEqual(expectedInfoMessage(eventsTab, eventsSubTab));
  });

  it('getEventsMessage will return null if events are found', function () {
    expect(FeedMessages.getEventsMessage(
      [],
      [],
      [testEvent],
      eventsTab
    ))
      .toEqual(expectedEmptyMessage());
  });

  it('getCoursesMessage will return error if courses cannot be fetched', function () {
    expect(FeedMessages.getCoursesMessage(
      null,
      [],
      [],
      coursesTab
    ))
      .toEqual(expectedErrorMessage(coursesTab));
  });

  it('getCoursesMessage will return info message'
    + ' if courses are filtered to empty array', function () {
    expect(FeedMessages.getCoursesMessage(
      [],
      [],
      [],
      coursesTab, coursesSubTab
    ))
      .toEqual(expectedInfoMessage(coursesTab, coursesSubTab));
  });

  it('getCoursesMessage will return null if courses are found', function () {
    expect(FeedMessages.getCoursesMessage(
      [],
      [],
      [testCourse],
      coursesTab
    ))
      .toEqual(expectedEmptyMessage());
  });

  it('getCalendarMessage will return error if events cannot be fetched', function () {
    expect(FeedMessages.getCalendarMessage(
      [],
      null,
      [],
      eventsTab,
      calendarSubTab
    ))
      .toEqual(expectedErrorMessage(eventsTab));
  });

  it('getCalendarMessage will return return null if events'
    + ' are filtered to empty array', function () {
    expect(FeedMessages.getCalendarMessage(
      [],
      [],
      [],
      eventsTab
    ))
      .toEqual(expectedEmptyMessage());
  });

  it('getCalendarMessage will return return null if events are found', function () {
    expect(FeedMessages.getCalendarMessage(
      [],
      [],
      [testEvent],
      calendarSubTab
    ))
      .toEqual(expectedEmptyMessage());
  });
});
