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
  'services.state'
])

  .constant('FeedItemTimeCondition', {
    'ALL': 'ALL',
    'UPCOMING': 'UPCOMING',
    'CURRENT': 'CURRENT',
    'PAST': 'PAST'
  })

  .constant('FeedItemSortCondition', {
    'NONE': 'NONE',
    'START_DATE_ASC': 'START_DATE_ASC'
  })

  .factory('Tabs', function($filter, FeedItemTimeCondition, FeedItemSortCondition) {

    function getItems(items, feedItemTimeCondition, feedItemSortCondition) {
      var filteredFeedItems = $filter('filterFeedItems')(items, feedItemTimeCondition);

      return $filter('sortFeedItems')(filteredFeedItems, feedItemSortCondition);
    }

    return {
      'UPCOMING_EVENTS': {
        key: 'UPCOMING_EVENTS',
        translateKey: 'weekFeed.timetable',
        getItems: function(courses, events) {
          return getItems(events, FeedItemTimeCondition.UPCOMING, FeedItemSortCondition.NONE);
        },
        showFirstItemImage: true
      },
      'COURSES': {
        key: 'COURSES',
        translateKey: 'general.courses',
        getItems: function(courses, events) {
          return getItems(_.filter(courses, {isExam: false}),
            FeedItemTimeCondition.ALL, FeedItemSortCondition.NONE);
        }
      },
      'STUDENT_EXAMS': {
        key: 'STUDENT_EXAMS',
        translateKey: 'general.exams',
        getItems: function(courses, events) {
          return getItems(_.filter(events, {type: 'EXAM'}),
            FeedItemTimeCondition.UPCOMING, FeedItemSortCondition.NONE);
        }
      },
      'TEACHER_EXAMS': {
        key: 'TEACHER_EXAMS',
        translateKey: 'general.exams',
        getItems: function(courses, events) {
          return getItems(_.filter(courses, {isExam: true}),
            FeedItemTimeCondition.UPCOMING, FeedItemSortCondition.NONE);
        }
      },
      'CURRENT_TEACHER_COURSES': {
        key: 'CURRENT_TEACHER_COURSES',
        translateKey: 'general.teaching',
        getItems: function(courses, events) {
          return getItems(_.filter(courses, {isExam: false}),
            FeedItemTimeCondition.CURRENT, FeedItemSortCondition.START_DATE_ASC);
        }
      },
      'PAST_TEACHER_COURSES': {
        key: 'PAST_TEACHER_COURSES',
        translateKey: 'general.pastTeaching',
        getItems: function(courses, events) {
          return getItems(courses, FeedItemTimeCondition.PAST, FeedItemSortCondition.NONE);
        }
      },
      'CALENDAR': {
        key: 'CALENDAR',
        translateKey: 'navigationTab.calendar',
        getItems: function(courses, events) {
          return [];
        }
      }
    };
  })

  .constant('TabConfiguration', {
    'opintoni': [
      'UPCOMING_EVENTS',
      'COURSES',
      'STUDENT_EXAMS',
      'CALENDAR'
    ],
    'opetukseni': [
      'UPCOMING_EVENTS',
      'CURRENT_TEACHER_COURSES',
      'TEACHER_EXAMS',
      'PAST_TEACHER_COURSES',
      'CALENDAR'
    ]
  })

  .filter('filterFeedItems', function(FeedItemTimeCondition) {
    return function(items, filterType) {
      var nowMoment = moment.utc();

      switch (filterType) {
        case FeedItemTimeCondition.ALL:
          return items;
        case FeedItemTimeCondition.UPCOMING:
          return _.filter(items, function(item) {
            return nowMoment.isBefore(item.startDate);
          });
        case FeedItemTimeCondition.CURRENT:
          return _.filter(items, function(item) {
            var startDate = item.startDate,
                endDate = item.endDate;

            return nowMoment.isBetween(startDate, endDate) ||
              nowMoment.isSame(startDate) ||
              nowMoment.isSame(endDate);
          });
        case FeedItemTimeCondition.PAST:
          return _.filter(items, function(item) {
            return nowMoment.isAfter(item.endDate);
          });
        default:
          // FIXME: error, anyone?
      }
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
        default:
          // FIXME: error, anyone?
      }
    };
  })

  .constant('WeekFeedMessageKeys', {
    'UPCOMING_EVENTS': {
      info: 'weekFeed.noUpcomingEvents',
      error: 'weekFeed.errors.errorLoadingFutureEvents'
    },
    'COURSES': {
      info: 'weekFeed.noCourses',
      error: 'weekFeed.errors.errorLoadingCourses'
    },
    'STUDENT_EXAMS': {
      info: 'weekFeed.noExams',
      error: 'weekFeed.errors.errorLoadingExams'
    },
    'TEACHER_EXAMS': {
      info: 'weekFeed.noExams',
      error: 'weekFeed.errors.errorLoadingExams'
    },
    'CURRENT_TEACHER_COURSES': {
      info: 'weekFeed.noCurrentTeacherCourses',
      error: 'weekFeed.errors.errorLoadingCourses'
    },
    'PAST_TEACHER_COURSES': {
      info: 'weekFeed.noPastTeacherCourses',
      error: 'weekFeed.errors.errorLoadingCourses'
    }
  })

  .directive('weekFeed', function(
    $filter,
    State,
    StateService,
    Tabs,
    TabConfiguration,
    MessageTypes,
    WeekFeedMessageKeys,
    UserPreferencesService,
    AnalyticsService) {

    return {
      restrict: 'E',
      templateUrl: 'app/directives/weekFeed/weekFeed.html',
      scope: {
        courses: '=',
        events: '='
      },
      link: function($scope) {
        var currentStateName = StateService.getRootStateName();

        $scope.State = State;
        $scope.Tabs = Tabs;
        $scope.tabs = [];
        $scope.feedItems = [];
        $scope.numberOfVisibleItems = 5;

        _.each(TabConfiguration[currentStateName], function(tabKey) {
          $scope.tabs.push(Tabs[tabKey]);
        });

        $scope.selectedTab = _.find($scope.tabs, {
          key: UserPreferencesService.getPreferences().selectedTab
        }) || $scope.tabs[0];

        $scope.feedItems = $scope.selectedTab.getItems($scope.courses, $scope.events);

        $scope.header = $filter('translate')(currentStateName === State.MY_STUDIES ?
          'weekFeed.nowStudying' :
          'weekFeed.nowTeaching');

        $scope.selectTab = function selectTab(selectedTab) {
          $scope.numberOfVisibleItems = 5;
          $scope.selectedTab = selectedTab;
          $scope.feedItems = $scope.selectedTab.getItems($scope.courses, $scope.events);
          UserPreferencesService.addProperty('selectedTab', selectedTab.key);
          AnalyticsService.trackShowWeekFeedTab(selectedTab.key);
        };

        $scope.$watch('selectedTab', function() {
          if($scope.feedItems.length === 0 && $scope.selectedTab.key !== 'CALENDAR') {
            $scope.message = {
              messageType: MessageTypes.INFO,
              key: WeekFeedMessageKeys[$scope.selectedTab.key][MessageTypes.INFO]
            };
          } else {
            $scope.message = null;
          }
        });

        $scope.showMore = function showMore() {
          $scope.numberOfVisibleItems += 5;
        };

        $scope.showMoreVisible = function showMoreVisible() {
          return $scope.feedItems.length > $scope.numberOfVisibleItems;
        };

        $scope.getTabClasses = function getTabClasses(tab) {
          return {
            'active': tab === $scope.selectedTab
          };
        };
      }
    };
  });
