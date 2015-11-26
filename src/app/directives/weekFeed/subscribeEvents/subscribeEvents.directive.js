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
  'utils.browser',
  'utils.domain',
  'directives.clipboard'])

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

  .constant({
    'MessageTimeouts': {
      'SUCCESS': 1000,
      'FAIL': 2000
    }
  })

  .directive('subscribeEvents', function(CalendarFeedResource,
                                         InstructionLinks,
                                         $rootScope,
                                         $q,
                                         BrowserUtil,
                                         DomainUtil,
                                         $timeout,
                                         MessageTimeouts) {
    return {
      rescrict: 'E',
      replace: true,
      templateUrl: 'app/directives/weekFeed/subscribeEvents/subscribeEvents.html',
      scope: {},
      controller: function($scope) {
        $scope.InstructionLinks = InstructionLinks;
        $scope.userLang = $rootScope.userLang;
        $scope.showCopyToClipboard = !BrowserUtil.isMobile();

        function getOrCreateCalendarFeed() {
          var deferred = $q.defer();

          CalendarFeedResource.getCalendarFeed().$promise.then(function getCalendarFeedSuccess(calendarFeed) {
            deferred.resolve(calendarFeed);
          }, function getCalendarFeedFail() {
            CalendarFeedResource.saveCalendarFeed().$promise.then(function saveCalendarFeedSuccess(calendarFeed) {
              deferred.resolve(calendarFeed);
            })
          });
          return deferred.promise;
        }

        $scope.onClick = function() {
          getOrCreateCalendarFeed().then(function(calendarFeed) {
            $scope.calendarFeedUrl = DomainUtil.getDomain() + calendarFeed.feedUrl + '/' + $rootScope.userLang;
          });
        };

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
        }
      }
    }
  });