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

angular.module('directives.subscribeEvents', [
  'resources.calendarFeed',
  'utils.domain',
  'directives.weekfeed.calendarSubscription.popover'])

  .constant({
    'MessageTimeouts': {
      'SUCCESS': 1000,
      'FAIL': 2000
    }
  })

  .directive('subscribeEvents', function(CalendarFeedResource,
                                         $rootScope,
                                         $q,
                                         DomainUtil,
                                         AnalyticsService) {
    return {
      rescrict: 'E',
      replace: true,
      templateUrl: 'app/directives/weekFeed/subscribeEvents/subscribeEvents.html',
      scope: {},
      controller: function($scope) {
        var cachedCalendarFeedBaseUrl;

        $scope.userLang = $rootScope.userLang;
        $scope.showPopover = false;

        function getOrCreateCalendarFeed() {
          return CalendarFeedResource.getCalendarFeed()
            .catch(function() {
              return CalendarFeedResource.saveCalendarFeed();
            })
            .then(function(calendarFeed) {
              AnalyticsService.trackCalendarSubscribe();
              cachedCalendarFeedBaseUrl = DomainUtil.getDomain() + calendarFeed.feedUrl + '/';
              return calendarFeed;
            });
        }

        function localizedCalendarFeedUrl() {
          $scope.calendarFeedUrl = cachedCalendarFeedBaseUrl + $rootScope.userLang;
          return $scope.calendarFeedUrl;
        }

        $scope.onClick = function() {
          $scope.showPopover = !$scope.showPopover;

          if($scope.showPopover) {
            return $q(function(resolve, reject) {
              return cachedCalendarFeedBaseUrl ? resolve() : reject();
            })
            .catch(getOrCreateCalendarFeed)
            .then(localizedCalendarFeedUrl);
          }
        };
      }
    };
  });
