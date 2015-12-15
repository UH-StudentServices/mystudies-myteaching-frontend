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
  'services.eventUri',
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
    'START_DATE_ASC' : 'START_DATE_ASC'
  })

  .constant('tabs', {
    'UPCOMING_EVENTS': 'UPCOMING_EVENTS',
    'COURSES': 'COURSES',
    'EXAMS': 'EXAMS',
    'CURRENT_TEACHER_COURSES': 'CURRENT_TEACHER_COURSES',
    'PAST_TEACHER_COURSES': 'PAST_TEACHER_COURSES',
    'CALENDAR': 'CALENDAR'
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
            var startDate = item.startDate;
            var endDate = item.endDate;
            return nowMoment.isBetween(startDate, endDate) || nowMoment.isSame(startDate) || nowMoment.isSame(endDate);
          });
        case FeedItemTimeCondition.PAST:
          return _.filter(items, function(item) {
            return nowMoment.isAfter(item.endDate);
          });
      }
    }
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
      }
    }
  })

  .constant('WeekFeedMessageKeys', {
    "UPCOMING_EVENTS": {info: "weekFeed.noUpcomingEvents", error: "weekFeed.errors.errorLoadingFutureEvents"},
    "COURSES": {info: "weekFeed.noCourses", error: "weekFeed.errors.errorLoadingCourses"},
    "EXAMS": {info: "weekFeed.noExams", error: "weekFeed.errors.errorLoadingExams"},
    "CURRENT_TEACHER_COURSES": {info: "weekFeed.noCurrentTeacherCourses", error: "weekFeed.errors.errorLoadingCourses"},
    "PAST_TEACHER_COURSES": {info: "weekFeed.noPastTeacherCourses", error: "weekFeed.errors.errorLoadingCourses"}
  })

  .directive('weekFeed', function(
    $filter,
    $q,
    State,
    StateService,
    FeedItemTimeCondition,
    FeedItemSortCondition,
    tabs,
    MessageTypes,
    WeekFeedMessageKeys,
    UserPreferencesService,
    LocationService,
    EventUriService,
    AnalyticsService) {


    return {
      restrict: 'E',
      templateUrl: 'app/directives/weekFeed/weekFeed.html',
      scope: {
        courses: '=',
        events: '='
      },
      link: function($scope) {
        $scope.feedItems = [];
        $scope.tabs = tabs;
        $scope.FeedItemTimeCondition = FeedItemTimeCondition;
        $scope.currentStateName = StateService.getRootStateName();
        $scope.State = State;
      
        var selectedFeedItemFilterType = FeedItemTimeCondition.ALL;
        var selectedFeedItemSortType = FeedItemSortCondition.NONE;

        var exams = _.filter($scope.events, {type: 'EXAM'});

        setSelectedTab(getDefaultTab());

        function getDefaultTab() {
          return UserPreferencesService.getPreferences().selectedTab || tabs.UPCOMING_EVENTS;
        }

        function setSelectedTab(selectedTab) {
          $scope.numberOfVisibleItems = 5;
          $scope.selectedTab = selectedTab;
          UserPreferencesService.addProperty('selectedTab', selectedTab);
          AnalyticsService.trackShowWeekFeedTab(selectedTab);
          switch (selectedTab) {
            case tabs.UPCOMING_EVENTS:
              setFeedItems($scope.events, FeedItemTimeCondition.UPCOMING, FeedItemSortCondition.NONE);
              break;
            case tabs.COURSES:
              setFeedItems($scope.courses, FeedItemTimeCondition.ALL, FeedItemSortCondition.NONE);
              break;
            case tabs.EXAMS:
              setFeedItems(exams, FeedItemTimeCondition.UPCOMING, FeedItemSortCondition.NONE);
              break;
            case tabs.CURRENT_TEACHER_COURSES:
              setFeedItems($scope.courses, FeedItemTimeCondition.CURRENT, FeedItemSortCondition.START_DATE_ASC);
              break;
            case tabs.PAST_TEACHER_COURSES:
              setFeedItems($scope.courses, FeedItemTimeCondition.PAST, FeedItemSortCondition.NONE);
              break;
            case tabs.CALENDAR:
              $scope.feedItems = [];
              break;
          }
        }

        function setMessage(messageType) {
          $scope.message = {
            messageType: messageType,
            key: WeekFeedMessageKeys[$scope.selectedTab][messageType]
          };
        }

        function setFeedItems(items, feedItemTimeCondition, feedItemSortCondition) {
          $scope.message = null;
            
          var filteredFeedItems = $filter('filterFeedItems')(items, feedItemTimeCondition);
          $scope.feedItems = $filter('sortFeedItems')(filteredFeedItems, feedItemSortCondition);

          if ($scope.feedItems.length === 0) {
            setMessage(MessageTypes.INFO);
          }
         
        }

        $scope.showMore = function showMore() {
          $scope.numberOfVisibleItems += 5;
        };

        $scope.showMoreVisible = function showMoreVisible() {
          return $scope.feedItems.length > $scope.numberOfVisibleItems;
        };

        $scope.tabSelect = function tabSelect(selectedTab) {
          setSelectedTab(selectedTab);
        };

        $scope.showCourseImage = function showCourseImage($first, feedItem) {
          return $first && $scope.selectedTab === tabs.UPCOMING_EVENTS && feedItem.courseImageUri;
        };
      }
    };
  });