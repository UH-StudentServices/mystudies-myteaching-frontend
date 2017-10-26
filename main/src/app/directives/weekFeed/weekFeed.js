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

angular.module('directives.weekFeed', [
  'filters.moment',
  'directives.message',
  'directives.subscribeEvents',
  'directives.eventCalendar',
  'directives.weekFeed.feedItem',
  'services.userPreferences',
  'services.state',
  'utils.loader'
])

  .constant('FeedItemTimeCondition', {
    'ALL': 'ALL',
    'UPCOMING': 'UPCOMING',
    'NOT_ENDED': 'NOT_ENDED',
    'CURRENT': 'CURRENT',
    'CURRENT_OR_UPCOMING': 'CURRENT_OR_UPCOMING',
    'PAST': 'PAST'
  })

  .constant('FeedItemSortCondition', {
    'NONE': 'NONE',
    'START_DATE_ASC': 'asc',
    'START_DATE_DESC': 'desc'
  })

  .factory('FeedMessages', function(
    MessageTypes,
    WeekFeedMessageKeys) {

    function getEventsMessage(courses, events, filteredItems, selectedTab, selectedSubTab) {
      return getItemsMessage(events, filteredItems, selectedTab, selectedSubTab);
    }

    function getCoursesMessage(courses, events, filteredItems, selectedTab, selectedSubTab) {
      return getItemsMessage(courses, filteredItems, selectedTab, selectedSubTab);
    }

    function getCalendarMessage(courses, events, filteredItems, selectedTab) {
      if (!events) {
        return getErrorMessage(selectedTab);
      }
    }

    function getItemsMessage(items, filteredItems, selectedTab, selectedSubTab) {
      if (!items) {
        return getErrorMessage(selectedTab);
      } else if (!filteredItems.length) {
        return getInfoMessage(selectedTab, selectedSubTab);
      }
    }

    function getInfoMessage(selectedTab, selectedSubTab) {
      return {
        messageType: MessageTypes.INFO,
        key: _.get(WeekFeedMessageKeys, [selectedTab, MessageTypes.INFO, selectedSubTab])
      };
    }

    function getErrorMessage(selectedTab) {
      return {
        messageType: MessageTypes.ERROR,
        key: _.get(WeekFeedMessageKeys, [selectedTab, MessageTypes.ERROR])
      };
    }

    return {
      getEventsMessage: getEventsMessage,
      getCoursesMessage: getCoursesMessage,
      getCalendarMessage: getCalendarMessage
    };
  })

  .factory('CourseView', function(FeedItemSortCondition, FeedItemTimeCondition, FeedItemTimeFilter) {

    function getCourses(courses, feedItemTimeCondition, feedItemSortCondition, now) {
      courses = _.filter(courses, function(course) {
        return filterCourse(course, courses, feedItemTimeCondition, now);
      });

      return _(courses)
        .filter(function(course) {return isRootNode(course, courses); })
        .map(function(rootNode) { return setRootNodeChildren(rootNode, courses, feedItemSortCondition); })
        .orderBy(function(rootNode) { return sortRootNode(rootNode, feedItemSortCondition); }, feedItemSortCondition)
        .map(function(rootNode) {
          return [rootNode].concat(rootNode.children);
        })
        .flatten()
        .value();
    }

    function setRootNodeChildren(rootNode, courses, feedItemSortCondition) {
      rootNode.children = _(courses)
        .filter(function(child) { return child.parentId && rootNode.realisationId === child.rootId; })
        .orderBy(function(child) { return child.startDate; }, feedItemSortCondition)
        .map(tagAsChild)
        .value();
      tagLastChild(rootNode.children);
      return rootNode;
    }

    function sortRootNode(rootNode, feedItemSortCondition) {
      var findMinOrMax = feedItemSortCondition === FeedItemSortCondition.START_DATE_ASC ? _.minBy : _.maxBy,
          minOrMaxChild = findMinOrMax(rootNode.children, getStartDate);

      return minOrMaxChild ? minOrMaxChild.startDate : rootNode.startDate;
    }

    function getStartDate(course) { return course.startDate; }

    function tagAsChild(child) {
      child.showAsChild = true;
      return child;
    }

    function tagLastChild(children) {
      var lastChild = _.last(children);

      if (lastChild) {
        lastChild.showAsLastChild = true;
      }
    }

    function isRootNode(course, courses) {
      return course.parentId === null || _.find(courses, {'realisationId': course.rootId}) === undefined;
    }

    function filterCourse(item, courses, timeCondition, now) {
      return _(courses)
          .filter(function(child) {
            return child.rootId === item.realisationId && child.realisationId !== item.realisationId;
          })
          .some(function(child) { return filterCourse(child, courses, timeCondition, now); }) ||
          FeedItemTimeFilter.isInTimeFrame(item, timeCondition, now);
    }

    return {
      getCourses: getCourses
    };
  })

  .factory('Tabs', function(
    $filter,
    CourseView,
    FeedItemTimeCondition,
    FeedItemSortCondition,
    FeedMessages) {

    var getEventsMessage = FeedMessages.getEventsMessage,
        getCoursesMessage = FeedMessages.getCoursesMessage,
        getCalendarMessage = FeedMessages.getCalendarMessage;

    function getItems(items, feedItemTimeCondition, feedItemSortCondition) {
      var filteredFeedItems = $filter('filterFeedItems')(items, feedItemTimeCondition);

      return $filter('sortFeedItems')(filteredFeedItems, feedItemSortCondition);
    }

    return {
      'SCHEDULE': {
        key: 'SCHEDULE',
        translateKey: 'weekFeed.timetable',
        subTabs: {
          'SCHEDULE_LIST': {
            key: 'SCHEDULE_LIST',
            hideSubTabs: false,
            translateKey: 'weekFeed.calendarCustom.list',
            getItems: function(courses, events) {
              return getItems(events, FeedItemTimeCondition.CURRENT_OR_UPCOMING, FeedItemSortCondition.NONE);
            },
            getMessage: getEventsMessage,
          },
          'CALENDAR_DAY': {
            key: 'CALENDAR_DAY',
            hideSubTabs: true,
            calendarView: 'DAY',
            translateKey: 'eventCalendar.day',
            getItems: function(courses, events) {
              return [];
            },
            getMessage: getCalendarMessage
          },
          'CALENDAR_WEEK': {
            key: 'CALENDAR_WEEK',
            hideSubTabs: true,
            calendarView: 'WEEK',
            translateKey: 'eventCalendar.week',
            getItems: function(courses, events) {
              return [];
            },
            getMessage: getCalendarMessage
          },
          'CALENDAR_MONTH': {
            key: 'CALENDAR_MONTH',
            hideSubTabs: true,
            calendarView: 'MONTH',
            translateKey: 'eventCalendar.month',
            getItems: function(courses, events) {
              return [];
            },
            getMessage: getCalendarMessage
          }
        },
        showFirstItemImage: true
      },
      'COURSES': {
        key: 'COURSES',
        translateKey: 'general.courses',
        subTabs: {
          'CURRENT_COURSES': {
            key: 'CURRENT_COURSES',
            hideSubTabs: false,
            translateKey: 'general.current',
            getItems: function(courses, events) {
              return CourseView.getCourses(_.filter(courses, {isExam: false}),
                FeedItemTimeCondition.CURRENT, FeedItemSortCondition.START_DATE_ASC);
            },
            getMessage: getCoursesMessage
          },
          'UPCOMING_COURSES': {
            key: 'UPCOMING_COURSES',
            hideSubTabs: false,
            translateKey: 'general.upcoming',
            getItems: function(courses, events) {
              return CourseView.getCourses(_.filter(courses, {isExam: false}),
                FeedItemTimeCondition.UPCOMING, FeedItemSortCondition.START_DATE_ASC);
            },
            getMessage: getCoursesMessage
          },
          'PAST_COURSES': {
            key: 'PAST_COURSES',
            hideSubTabs: false,
            translateKey: 'general.past',
            getItems: function(courses, events) {
              return CourseView.getCourses(_.filter(courses, {isExam: false}),
                FeedItemTimeCondition.PAST, FeedItemSortCondition.START_DATE_DESC);
            },
            getMessage: getCoursesMessage
          }
        }
      },
      'STUDENT_EXAMS': {
        key: 'STUDENT_EXAMS',
        translateKey: 'general.exams',
        subTabs: {
          'UPCOMING_EXAMS': {
            key: 'UPCOMING_EXAMS',
            hideSubTabs: false,
            translateKey: 'general.upcoming',
            getItems: function(courses, events) {
              return CourseView.getCourses(_.filter(courses, {isExam: true}),
                FeedItemTimeCondition.NOT_ENDED, FeedItemSortCondition.START_DATE_ASC);
            },
            getMessage: getEventsMessage
          },
          'PAST_EXAMS': {
            key: 'PAST_EXAMS',
            hideSubTabs: false,
            translateKey: 'general.past',
            getItems: function(courses, events) {
              return CourseView.getCourses(_.filter(courses, {isExam: true}),
                FeedItemTimeCondition.PAST, FeedItemSortCondition.START_DATE_ASC);
            },
            getMessage: getEventsMessage
          },
        }
      },
      'TEACHING': {
        key: 'TEACHING',
        translateKey: 'general.teaching',
        subTabs: {
          'CURRENT_TEACHER_COURSES': {
            key: 'CURRENT_TEACHER_COURSES',
            hideSubTabs: false,
            translateKey: 'general.current',
            getItems: function(courses, events) {
              return CourseView.getCourses(_.filter(courses, {isExam: false}),
                FeedItemTimeCondition.CURRENT, FeedItemSortCondition.START_DATE_ASC);
            },
            getMessage: getCoursesMessage
          },
          'UPCOMING_TEACHER_COURSES': {
            key: 'UPCOMING_TEACHER_COURSES',
            hideSubTabs: false,
            translateKey: 'general.upcoming',
            getItems: function(courses, events) {
              return CourseView.getCourses(_.filter(courses, {isExam: false}),
                FeedItemTimeCondition.UPCOMING, FeedItemSortCondition.START_DATE_ASC);
            },
            getMessage: getCoursesMessage
          },
          'PAST_TEACHER_COURSES': {
            key: 'PAST_TEACHER_COURSES',
            hideSubTabs: false,
            translateKey: 'general.past',
            getItems: function(courses, events) {
              return CourseView.getCourses(_.filter(courses, {isExam: false}),
              FeedItemTimeCondition.PAST, FeedItemSortCondition.START_DATE_DESC);
            },
            getMessage: getCoursesMessage
          }
        }
      },
      'TEACHER_EXAMS': {
        key: 'TEACHER_EXAMS',
        translateKey: 'general.exams',
        subTabs: {
          'UPCOMING_TEACHER_EXAMS': {
            key: 'UPCOMING_TEACHER_EXAMS',
            hideSubTabs: false,
            translateKey: 'general.upcoming',
            getItems: function(courses, events) {
              return CourseView.getCourses(_.filter(courses, {isExam: true}),
                FeedItemTimeCondition.NOT_ENDED, FeedItemSortCondition.START_DATE_ASC);
            },
            getMessage: getCoursesMessage
          },
          'PAST_TEACHER_EXAMS': {
            key: 'PAST_TEACHER_EXAMS',
            hideSubTabs: false,
            translateKey: 'general.past',
            getItems: function(courses, events) {
              return CourseView.getCourses(_.filter(courses, {isExam: true}),
                FeedItemTimeCondition.PAST, FeedItemSortCondition.START_DATE_DESC);
            },
            getMessage: getCoursesMessage
          }
        }
      }
    };
  })

  .constant('TabConfiguration', {
    'opintoni': [
      'SCHEDULE',
      'COURSES',
      'STUDENT_EXAMS'
    ],
    'opetukseni': [
      'SCHEDULE',
      'TEACHING',
      'TEACHER_EXAMS'
    ]
  })

  .factory('FeedItemTimeFilter', function(FeedItemTimeCondition) {
    function isInTimeFrame(item, timeCondition, now) {
      var nowMoment = now || moment.utc();

      switch (timeCondition) {
        case FeedItemTimeCondition.ALL:
          return true;
        case FeedItemTimeCondition.UPCOMING:
          return nowMoment.isBefore(item.startDate);
        case FeedItemTimeCondition.NOT_ENDED:
          return !nowMoment.isAfter(item.endDate);
        case FeedItemTimeCondition.TODAY:
          return nowMoment.startOf('day').isSame(item.startDate.startOf('day'));
        case FeedItemTimeCondition.CURRENT:
          return nowMoment.isBetween(item.startDate, item.endDate) ||
            nowMoment.isSame(item.startDate) ||
            nowMoment.isSame(item.endDate);
        case FeedItemTimeCondition.CURRENT_OR_UPCOMING:
          return nowMoment.isBefore(item.endDate);
        case FeedItemTimeCondition.PAST:
          return nowMoment.isAfter(item.endDate);
        default:
          return true;
      }
    }

    return {
      isInTimeFrame: isInTimeFrame
    };

  })

  .filter('filterFeedItems', function(FeedItemTimeCondition, FeedItemTimeFilter) {
    return function(items, timeCondition, now) {
      return _.filter(items, function(item) {
        return FeedItemTimeFilter.isInTimeFrame(item, timeCondition, now);
      });
    };
  })

  .filter('sortFeedItems', function(FeedItemSortCondition) {
    return function(items, filterType) {
      switch (filterType) {
        case FeedItemSortCondition.NONE:
          return items;
        case FeedItemSortCondition.START_DATE_ASC:
          return _.sortBy(items, function(item) {
            return item.startDate.unix();
          });
        case FeedItemSortCondition.START_DATE_DESC:
          return _.sortBy(items, function(item) {
            return -item.startDate.unix();
          });
        default:
          // FIXME: error, anyone?
      }
    };
  })

  .constant('WeekFeedMessageKeys', {
    'SCHEDULE': {
      info: {
        'SCHEDULE_LIST': 'weekFeed.noEvents'
      },
      error: 'weekFeed.errors.errorLoadingEvents'
    },
    'COURSES': {
      info: {
        'CURRENT_COURSES': 'weekFeed.noOngoingCourses',
        'UPCOMING_COURSES': 'weekFeed.noUpcomingCourses',
        'PAST_COURSES': 'weekFeed.noPastCourses'
      },
      error: 'weekFeed.errors.errorLoadingCourses'
    },
    'STUDENT_EXAMS': {
      info: {
        'CURRENT_EXAMS': 'weekFeed.noExams',
        'UPCOMING_EXAMS': 'weekFeed.noExams',
        'PAST_EXAMS': 'weekFeed.noPastExams'
      },
      error: 'weekFeed.errors.errorLoadingExams'
    },
    'TEACHING': {
      info: {
        'CURRENT_TEACHER_COURSES': 'weekFeed.noCurrentTeacherCourses',
        'UPCOMING_TEACHER_COURSES': 'weekFeed.noUpcomingTeacherCourses',
        'PAST_TEACHER_COURSES': 'weekFeed.noPastTeacherCourses'
      },
      error: 'weekFeed.errors.errorLoadingCourses'
    },
    'TEACHER_EXAMS': {
      info: {
        'CURRENT_TEACHER_EXAMS': 'weekFeed.noExams',
        'UPCOMING_TEACHER_EXAMS': 'weekFeed.noExams',
        'PAST_TEACHER_EXAMS': 'weekFeed.noPastExams'
      },
      error: 'weekFeed.errors.errorLoadingExams'
    }
  })

  .constant('InitialVisibleItems', 5)
  .constant('LoaderKey', 'weekFeed')

  .directive('weekFeed', function(
    $q,
    $filter,
    $state,
    $stateParams,
    State,
    StateService,
    Tabs,
    TabConfiguration,
    MessageTypes,
    WeekFeedMessageKeys,
    UserPreferencesService,
    AnalyticsService,
    InitialVisibleItems,
    Loader,
    LoaderKey) {

    return {
      restrict: 'E',
      templateUrl: 'app/directives/weekFeed/weekFeed.html',
      scope: {
        coursesPromise: '=',
        eventsPromise: '='
      },
      link: function($scope) {
        var currentStateName = StateService.getRootStateName(),
            tabs = _.pick(Tabs, TabConfiguration[currentStateName]),
            coursesPromise = $scope.coursesPromise,
            eventsPromise = $scope.eventsPromise;

        function updateFeedItems() {
          $scope.feedItems = $scope.selectedSubTab.getItems($scope.courses, $scope.events);
          $scope.message = $scope.selectedSubTab.getMessage(
            $scope.courses,
            $scope.events,
            $scope.feedItems,
            $scope.selectedTab.key,
            $scope.selectedSubTab.key);
        }

        function getFirstTab() {
          return _.find($scope.tabs, {key: _.get(TabConfiguration, [currentStateName, '0'])});
        }

        function getPreferredTab() {
          return _.find($scope.tabs, {
            key: UserPreferencesService.getPreferences().selectedTab
          }) || getFirstTab();
        }

        function getFirstSubTab() {
          return _.find($scope.selectedTab.subTabs, {});
        }

        function getPreferredSubTab() {
          return _.find($scope.selectedTab.subTabs, {
            key: UserPreferencesService.getPreferences().selectedSubTab
          }) || getFirstSubTab();
        }

        function mapToResolved(promises) {
          return _.map(promises, function(promise) {
            return promise.catch(function() {
              return true;
            });
          });
        }

        function updateEvents() {
          return eventsPromise.then(function(events) {
            $scope.events = events;
            return events;
          });
        }

        function updateCourses() {
          return coursesPromise.then(function(courses) {
            $scope.courses = courses;
            return courses;
          });
        }

        $scope.Tabs = Tabs;
        $scope.tabs = tabs;
        $scope.feedItems = [];
        $scope.numberOfVisibleItems = InitialVisibleItems;
        $scope.MessageTypes = MessageTypes;
        $scope.selectedTab = getPreferredTab();
        $scope.subTabs = $scope.selectedTab.subTabs;
        $scope.selectedSubTab = getPreferredSubTab();
        $scope.hideSubTabs = $scope.selectedSubTab.hideSubTabs;
        $scope.calendarView = $scope.selectedSubTab.calendarView;
        $scope.currentDate = $stateParams.currentDate ? $stateParams.currentDate : moment();
        $scope.studentMode = currentStateName === State.MY_STUDIES;

        Loader.start(LoaderKey);

        $q.all(mapToResolved([updateCourses(), updateEvents()]))
          .finally(function() {
            updateFeedItems();
            Loader.stop(LoaderKey);
          });

        $scope.header = $filter('translate')(currentStateName === State.MY_STUDIES ?
          'weekFeed.nowStudying' :
          'weekFeed.nowTeaching');

        $scope.selectTab = function selectTab(selectedTab) {
          $scope.numberOfVisibleItems = InitialVisibleItems;
          $scope.selectedTab = selectedTab;
          $scope.subTabs = $scope.selectedTab.subTabs;
          $scope.selectedSubTab = getFirstSubTab();
          $scope.hideSubTabs = $scope.selectedSubTab.hideSubTabs;
          updateFeedItems();
          UserPreferencesService.addProperty('selectedTab', selectedTab.key);
          AnalyticsService.trackShowWeekFeedTab(selectedTab.key);
        };

        $scope.selectSubTab = function selectSubTab(selectedSubTab) {
          $scope.numberOfVisibleItems = InitialVisibleItems;
          $scope.selectedSubTab = selectedSubTab;
          $scope.hideSubTabs = selectedSubTab.hideSubTabs;
          $scope.calendarView = selectedSubTab.calendarView;
          updateFeedItems();
          UserPreferencesService.addProperty('selectedSubTab', selectedSubTab.key);
          AnalyticsService.trackShowWeekFeedTab(selectedSubTab.key);
        };

        $scope.$on('changeWeekFeedSubTab', function(evt, params) {
          $scope.$apply(function() {
            $scope.selectSubTab(_.find($scope.selectedTab.subTabs, {key: params.subTab}));
          });
        });

        $scope.showMore = function showMore() {
          $scope.numberOfVisibleItems += 5;
        };

        $scope.showMoreVisible = function showMoreVisible() {
          return $scope.feedItems.length > $scope.numberOfVisibleItems;
        };

        $scope.getTabClasses = function getTabClasses(tab) {
          return {
            'is-active': tab === $scope.selectedTab
          };
        };

        $scope.getSubTabClasses = function getSubTabClasses(subTab) {
          return {
            'active': subTab === $scope.selectedSubTab
          };
        };

        $scope.showFullScreenCalendar = function showFullScreenCalendar() {
          $scope.$broadcast('eventCalendar.refreshCurrentDate');
          $state.go($state.current.data.calendarState, {currentDate: $scope.currentDate});
        };

      }
    };
  });
