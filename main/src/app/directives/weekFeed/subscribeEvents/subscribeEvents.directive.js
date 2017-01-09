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
  'utils.browser',
  'directives.clipboard',
  'directives.popover'])

  .constant({
    'MessageTimeouts': {
      'SUCCESS': 1000,
      'FAIL': 2000
    }
  })

  .constant('InstructionLinks', {
    OUTLOOK: {
      'fi': 'http://www.helsinki.fi/helpdesk/3294#outlook',
      'en': 'http://www.helsinki.fi/helpdesk/3294/eng#outlook',
      'sv': 'http://www.helsinki.fi/helpdesk/3294/sve#outlook'
    },
    GOOGLE: {
      'fi': 'https://support.google.com/calendar/answer/37100?hl=fi',
      'en': 'https://support.google.com/calendar/answer/37100?hl=en',
      'sv': 'https://support.google.com/calendar/answer/37100?hl=sv'
    }
  })

  .directive('subscribeEvents', function(CalendarFeedResource,
                                         $rootScope,
                                         $q,
                                         DomainUtil,
                                         AnalyticsService,
                                         InstructionLinks,
                                         BrowserUtil,
                                         $timeout,
                                         MessageTimeouts) {
    return {
      rescrict: 'E',
      replace: true,
      templateUrl: 'app/directives/weekFeed/subscribeEvents/subscribeEvents.html',
      scope: {},
      controller: function($scope) {
        var cachedCalendarFeedBaseUrl;

        $scope.showPopover = false;
        $scope.InstructionLinks = InstructionLinks;
        $scope.selectedLanguage = $rootScope.selectedLanguage;
        $scope.showCopyToClipboard = !BrowserUtil.isMobile();

        $scope.copyToClipboardSuccessCallback = function() {
          $scope.copyToClipboardSuccess = true;

          $timeout(function() {
            $scope.copyToClipboardSuccess = false;
          }, MessageTimeouts.SUCCESS);
        };

        $scope.copyToClipboardErrorCallback = function() {
          $scope.copyToClipboardFailMessageKeySuffix = BrowserUtil.isMac() ? 'Mac' : 'Other';
          $scope.copyToClipboardFail = true;

          $timeout(function() {
            $scope.copyToClipboardFail = false;
          }, MessageTimeouts.FAIL);
        };

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
          $scope.calendarFeedUrl = cachedCalendarFeedBaseUrl + $rootScope.selectedLanguage;
          return $scope.calendarFeedUrl;
        }

        $scope.closePopover = function() {
          $scope.showPopover = false;
        };

        $scope.onClick = function() {
          $scope.showPopover = !$scope.showPopover;

          if ($scope.showPopover) {
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
