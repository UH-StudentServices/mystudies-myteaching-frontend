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

angular.module('directives.subscribeEvents', [
  'resources.calendarFeed',
  'resources.optimeCalendar',
  'services.session',
  'utils.domain',
  'utils.browser',
  'directives.clipboard',
  'directives.popover'
])

  .constant({
    MessageTimeouts: {
      SUCCESS: 1000,
      FAIL: 2000
    }
  })

  .constant('InstructionLinks', {
    OUTLOOK: {
      fi: 'https://helpdesk.it.helsinki.fi/ohjeet/yhteydenpito-ja-julkaiseminen/kalentereiden-synkronointi',
      en: 'https://helpdesk.it.helsinki.fi/en/instructions/collaboration-and-publication/synchronising-different-calendars',
      sv: 'https://helpdesk.it.helsinki.fi/sv/instruktioner/kontakter-och-publicering/kalendersynkronisering'
    },
    GOOGLE: {
      fi: 'https://support.google.com/calendar/answer/37100?hl=fi',
      en: 'https://support.google.com/calendar/answer/37100?hl=en',
      sv: 'https://support.google.com/calendar/answer/37100?hl=sv'
    }
  })

  .directive('subscribeEvents', function (CalendarFeedResource,
    OptimeCalendarResource,
    Role,
    $rootScope,
    $q,
    DomainUtil,
    AnalyticsService,
    InstructionLinks,
    BrowserUtil,
    $timeout,
    StateService,
    State,
    MessageTimeouts) {
    return {
      rescrict: 'E',
      replace: true,
      templateUrl: 'app/directives/weekFeed/subscribeEvents/subscribeEvents.html',
      scope: {},
      controller: function ($scope) {
        $scope.showPopover = false;
        $scope.InstructionLinks = InstructionLinks;
        $scope.selectedLanguage = $rootScope.selectedLanguage;
        $scope.showCopyToClipboard = ClipboardJS.isSupported();

        $scope.copyToClipboardSuccessCallback = function () {
          $scope.copyToClipboardSuccess = true;

          $timeout(function () {
            $scope.copyToClipboardSuccess = false;
          }, MessageTimeouts.SUCCESS);
        };

        $scope.copyToClipboardErrorCallback = function () {
          $scope.copyToClipboardFailMessageKeySuffix = BrowserUtil.isMac() ? 'Mac' : 'Other';
          $scope.copyToClipboardFail = true;

          $timeout(function () {
            $scope.copyToClipboardFail = false;
          }, MessageTimeouts.FAIL);
        };

        function handleGetMyStudiesCalendarUrlResponse(calendarFeed) {
          $scope.calendarFeedUrl = DomainUtil.getDomain() + calendarFeed.feedUrl + '/' + $rootScope.selectedLanguage;
        }

        $scope.updateCalendarFeedUrl = function () {
          CalendarFeedResource.saveOrUpdateCalendarFeed()
            .then(handleGetMyStudiesCalendarUrlResponse);
        };

        function getMyStudiesTeachingCalendarUrl() {
          return CalendarFeedResource.getCalendarFeed()
            .catch(function () {
              return CalendarFeedResource.saveOrUpdateCalendarFeed();
            })
            .then(handleGetMyStudiesCalendarUrlResponse);
        }

        function getOptimeCalendarUrl() {
          return OptimeCalendarResource.getCalendarUrl()
            .catch(function () {
              return getMyStudiesTeachingCalendarUrl();
            })
            .then(function (optimeCalendarInfo) {
              if (optimeCalendarInfo.url) {
                $scope.optimeCalendar = true;
                $scope.calendarFeedUrl = optimeCalendarInfo.url;
                return undefined;
              }
              return getMyStudiesTeachingCalendarUrl();
            });
        }

        function getOrCreateCalendarFeedUrl() {
          AnalyticsService.trackCalendarSubscribe();
          if (StateService.getStateFromDomain() === State.MY_TEACHINGS) {
            return getOptimeCalendarUrl();
          }
          return getMyStudiesTeachingCalendarUrl();
        }

        $scope.closePopover = function () {
          $scope.showPopover = false;
        };

        $scope.onClick = function () {
          $scope.showPopover = !$scope.showPopover;
        };

        getOrCreateCalendarFeedUrl();
      }
    };
  });
