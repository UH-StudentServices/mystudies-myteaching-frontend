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

angular.module('directives.fullScreenCalendar', [
  'directives.eventCalendar',
  'utils.loader'
])

  .constant('TabsToCalendarViews', {
    CALENDAR_DAY: 'DAY',
    CALENDAR_WEEK: 'WEEK',
    CALENDAR_MONTH: 'MONTH'
  })

  .directive('fullScreenCalendar', function(
    $window,
    Loader,
    LoaderKey,
    UserPreferencesService,
    AnalyticsService,
    TabsToCalendarViews) {

    return {
      restrict: 'E',
      replace: 'true',
      scope: {
        eventsPromise: '=',
        onClose: '&'
      },
      templateUrl: 'app/directives/fullScreenCalendar/fullScreenCalendar.html',
      link: function($scope) {
        var eventsPromise = $scope.eventsPromise;

        Loader.start(LoaderKey);
        $scope.eventsPromise.then(function(events) {
          $scope.events = events;
        }).finally(function() {
          Loader.stop(LoaderKey);
        });

        $scope.oldScrollX = $window.scrollX;
        $scope.oldScrollY = $window.scrollY;
        $window.scrollTo(0,0);

        $scope.calendarView = TabsToCalendarViews[UserPreferencesService.getPreferences().selectedSubTab];

        $scope.$on('changeWeekFeedSubTab', function(evt, params) {
          $scope.$apply(function() {
            var tabName = params.subTab;

            $scope.calendarView = TabsToCalendarViews[tabName];
            UserPreferencesService.addProperty('selectedSubTab', tabName);
            AnalyticsService.trackShowWeekFeedTab(tabName);
          });
        });

        $scope.close = function close() {
          $scope.onClose();
          $window.scrollTo($scope.oldScrollX, $scope.oldScrollY);
        };
      }
    };
  });
