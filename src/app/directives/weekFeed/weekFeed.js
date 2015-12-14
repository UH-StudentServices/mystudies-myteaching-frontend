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
  'services.userPreferences',
  'services.eventUri',
  'services.state'
])

  .constant('feedItemFilterType', {
    'ALL': 'ALL',
    'UPCOMING': 'UPCOMING',
    'CURRENT': 'CURRENT',
    'PAST': 'PAST'
  })

  .constant('feedItemSortType', {
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
  
  .filter('filterFeedItems', function(feedItemFilterType) {
    return function(items, filterType) {

      var nowMoment = moment.utc();

      switch (filterType) {
        case feedItemFilterType.ALL:
          return items;
        case feedItemFilterType.UPCOMING:
          return _.filter(items, function(item) {
            return nowMoment.isBefore(item.startDate);
          });
        case feedItemFilterType.CURRENT:
          return _.filter(items, function(item) {
            var startDate = item.startDate;
            var endDate = item.endDate;
            return nowMoment.isBetween(startDate, endDate) || nowMoment.isSame(startDate) || nowMoment.isSame(endDate);
          });
        case feedItemFilterType.PAST:
          return _.filter(items, function(item) {
            return nowMoment.isAfter(item.endDate);
          });
      }
    }
  })

  .filter('sortFeedItems', function(feedItemSortType) {
    return function(items, filterType) {
      switch (filterType) {
        case feedItemSortType.NONE:
          return items;
        case feedItemSortType.START_DATE_ASC:
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
    feedItemFilterType,
    feedItemSortType,
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
        $scope.feedItemFilterType = feedItemFilterType;
        $scope.currentStateName = StateService.getRootStateName();
        $scope.State = State;
      
        var selectedFeedItemFilterType = feedItemFilterType.ALL;
        var selectedFeedItemSortType = feedItemSortType.NONE;

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
              setFeedItems($scope.events, feedItemFilterType.UPCOMING, feedItemSortType.NONE);
              break;
            case tabs.COURSES:
              setFeedItems($scope.courses, feedItemFilterType.ALL, feedItemSortType.NONE);
              break;
            case tabs.EXAMS:
              setFeedItems(exams, feedItemFilterType.UPCOMING, feedItemSortType.NONE);
              break;
            case tabs.CURRENT_TEACHER_COURSES:
              setFeedItems($scope.courses, feedItemFilterType.CURRENT, feedItemSortType.START_DATE_ASC);
              break;
            case tabs.PAST_TEACHER_COURSES:
              setFeedItems($scope.courses, feedItemFilterType.PAST, feedItemSortType.NONE);
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

        function setFeedItems(items, feedItemFilterType, feedItemSortType) {
          $scope.message = null;
            
          var filteredFeedItems = $filter('filterFeedItems')(items, selectedFeedItemFilterType);
          $scope.feedItems = $filter('sortFeedItems')(filteredFeedItems, selectedFeedItemSortType);

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

        $scope.openReittiopas = function(feedItem) {
          var addressFromCookie = LocationService.getUserAddressFromCookie();
          if (addressFromCookie) {
            window.location = EventUriService.getReittiopasUri(feedItem, addressFromCookie);
          } else {
            feedItem.loadingLocation = true;
            LocationService.getUserAddressFromGeolocation().then(function(data) {
              LocationService.putUserAddressToCookie(data);
              window.location = EventUriService.getReittiopasUri(feedItem, data);
            });
          }
        };
      }
    };
  })


  .filter('eventTimeSpan', function() {
    var dateString = 'DD.MM.YYYY';
    var hoursString = 'HH:mm';

    function momentDateHasHours(momentDate) {
      return _.isArray(momentDate._i) && momentDate._i.length > 3;
    }

    function getFormatString(momentDate) {
      if (momentDateHasHours(momentDate)) {
        return dateString + ' ' + hoursString;
      } else {
        return dateString;
      }
    }

    function formatMomentDate(momentDate) {
      return momentDate.format(getFormatString(momentDate));
    }

    function formatMomentDateSpan(startDate, endDate) {
      return formatMomentDate(startDate) + ' - ' + formatMomentDate(endDate);
    }

    function formatMomentDateTimeSpan(startDate, endDate) {
      var dateString = formatMomentDate(startDate);

      if (momentDateHasHours(startDate) && momentDateHasHours(endDate)) {
        dateString += ' - ' + endDate.format(hoursString);
      }
      return dateString;
    }

    return function(startDate, endDate) {

      /* Dates are UTC but we want to show them as local times */
      startDate = startDate.local();
      endDate = endDate.local();

      if (startDate.diff(endDate) === 0) {
        return formatMomentDate(startDate);
      } else if (startDate.year() == endDate.year() && startDate.dayOfYear() === endDate.dayOfYear()) {
        return formatMomentDateTimeSpan(startDate, endDate);
      } else {
        return formatMomentDateSpan(startDate, endDate);
      }
    }
  })

  .filter('eventDateSpan', function() {

    function formatMomentDate(momentDate) {
      return momentDate.format('DD.MM.YYYY');
    }

    function formatMomentDateSpan(startDate, endDate) {
      return formatMomentDate(startDate) + ' - ' + formatMomentDate(endDate);
    }

    return function(startDate, endDate) {

      /* Dates are UTC but we want to show them as local times */
      startDate = startDate.local();
      endDate = endDate.local();

      if (startDate.diff(endDate) === 0) {
        return formatMomentDate(startDate);
      } else {
        return formatMomentDateSpan(startDate, endDate);
      }
    }
  })


  .directive('eventTitle', function() {
    return {
      restrict : 'E',
      replace : true,
      templateUrl : 'app/directives/weekFeed/eventTitle.html'
    }
  })

  .directive('courseMaterialsLink', function() {
    return {
      restrict : 'E',
      replace : true,
      templateUrl : 'app/directives/weekFeed/courseMaterialsLink.html'
    }
  });