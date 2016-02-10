describe('FeedMessages', function() {

  var MessageTypes,
      FeedMessages,
      WeekFeedMessageKeys,
      eventsTab,
      coursesTab,
      calendarTab,
      testEvent = {},
      testCourse = {};


  beforeEach(module('directives.weekFeed'));

  function expectedErrorMessage(selectedTab) {
    return {
      messageType: MessageTypes.ERROR,
      key: WeekFeedMessageKeys[selectedTab].error
    };
  }

  function expectedInfoMessage(selectedTab) {
    return {
      messageType: MessageTypes.INFO,
      key: WeekFeedMessageKeys[selectedTab].info
    };
  }

  function expectedEmptyMessage() {}

  beforeEach(inject(function(_FeedMessages_, _MessageTypes_, _WeekFeedMessageKeys_, Tabs) {
    FeedMessages = _FeedMessages_;
    MessageTypes = _MessageTypes_;
    WeekFeedMessageKeys = _WeekFeedMessageKeys_;
    eventsTab = Tabs.UPCOMING_EVENTS.key;
    coursesTab = Tabs.COURSES.key;
    calendarTab = Tabs.CALENDAR.key;
  }));

  it('getEventsMessage will return error message if events cannot be fetched', function() {
    expect(FeedMessages.getEventsMessage(
      [],
      null,
      [],
      eventsTab))
      .toEqual(expectedErrorMessage(eventsTab));
  });

  it('getEventsMessage will return info message if events are filtered to empty array', function() {
    expect(FeedMessages.getEventsMessage(
      [],
      [],
      [],
      eventsTab))
      .toEqual(expectedInfoMessage(eventsTab));
  });

  it('getEventsMessage will return null if events are found', function() {
    expect(FeedMessages.getEventsMessage(
      [],
      [],
      [testEvent],
      eventsTab))
      .toEqual(expectedEmptyMessage());
  });

  it('getCoursesMessage will return error if courses cannot be fetched', function() {
    expect(FeedMessages.getCoursesMessage(
      null,
      [],
      [],
      coursesTab))
      .toEqual(expectedErrorMessage(coursesTab));
  });

  it('getCoursesMessage will return info message' +
    ' if courses are filtered to empty array', function() {
    expect(FeedMessages.getCoursesMessage(
      [],
      [],
      [],
      coursesTab))
      .toEqual(expectedInfoMessage(coursesTab));
  });

  it('getCoursesMessage will return null if courses are found', function() {
    expect(FeedMessages.getCoursesMessage(
      [],
      [],
      [testCourse],
      coursesTab))
      .toEqual(expectedEmptyMessage());
  });

  it('getCalendarMessage will return error if events cannot be fetched', function() {
    expect(FeedMessages.getCalendarMessage(
      [],
      null,
      [],
      calendarTab))
      .toEqual(expectedErrorMessage(calendarTab));
  });

  it('getCalendarMessage will return return null if events' +
    ' are filtered to empty array', function() {
    expect(FeedMessages.getCalendarMessage(
      [],
      [],
      [],
      calendarTab))
      .toEqual(expectedEmptyMessage());
  });

  it('getCalendarMessage will return return null if events are found', function() {
    expect(FeedMessages.getCalendarMessage(
      [],
      [],
      [testEvent],
      calendarTab))
      .toEqual(expectedEmptyMessage());
  });
});