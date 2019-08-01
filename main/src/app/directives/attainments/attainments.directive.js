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

angular.module('directives.attainments', [
  'services.attainments',
  'filters.moment',
  'filters.formatting',
  'constants.messageTypes'
])

  .constant('OodiLinks', {
    fi: 'https://weboodi.helsinki.fi/hy/alkusivu.jsp?Kieli=1',
    sv: 'https://weboodi.helsinki.fi/hy/alkusivu.jsp?Kieli=2',
    en: 'https://weboodi.helsinki.fi/hy/alkusivu.jsp?Kieli=6'
  })

  .directive('attainments', function (AttainmentsService, MessageTypes, $rootScope, OodiLinks) {
    return {
      restrict: 'E',
      templateUrl: 'app/directives/attainments/attainments.html',
      link: function ($scope) {
        $scope.hasAttainments = false;
        $scope.numberOfVisibleAttainments = 3;

        $scope.getOodiLink = function () {
          return OodiLinks[$rootScope.selectedLanguage];
        };

        AttainmentsService.hasStudyAttainments().then(function (hasAttainments) {
          $scope.hasAttainments = hasAttainments;
          if (hasAttainments) {
            AttainmentsService.getLastStudyAttainments().then(function (attainments) {
              $scope.attainments = attainments;
              if ($scope.attainments.length === 0) {
                $scope.message = {
                  messageType: MessageTypes.INFO,
                  key: 'attainments.noAttainmentsFromLastSixMonths'
                };
              }
            });
          } else {
            $scope.message = {
              messageType: MessageTypes.INFO,
              key: 'attainments.noAttainmentsYet'
            };
          }
        });
      }
    };
  });
