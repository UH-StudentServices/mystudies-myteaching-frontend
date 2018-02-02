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

angular.module('directives.analytics', [
  'opintoniAnalytics'
])

  .directive('analyticsEvent', function(AnalyticsService) {
    return {
      restrict: 'A',
      scope: {
        analyticsEvent: '='
      },
      link: function($scope, element) {
        element.on('mouseup', function(e) {
          // catch mouse primary and middle button clicks
          if (e.which === 1 || e.which === 2) {
            AnalyticsService.trackEvent(
              $scope.analyticsEvent.eventCategory,
              $scope.analyticsEvent.eventAction,
              $scope.analyticsEvent.value);
          }
        });
      }
    };
  });
