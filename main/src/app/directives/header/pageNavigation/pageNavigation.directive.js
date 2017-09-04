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

angular.module('directives.pageNavigation', [
  'constants.externalLinks',
  'services.configuration',
  'services.session',
  'services.state',
  'directives.analytics'
])

  .directive('pageNavigation', function() {
    return {
      restrict: 'E',
      templateUrl: 'app/directives/header/pageNavigation/pageNavigation.html',
      scope: {},
      controller: function($scope,
                           primaryLinks,
                           optionalLinks,
                           LanguageService,
                           SessionService,
                           StateService,
                           Configuration,
                           Role,
                           State) {
        $scope.primaryLinks = _.chain(primaryLinks[Configuration.environment])
          .filter(function(link) {
            return _.includes(link.domain, StateService.getStateFromDomain());
          })
          .map(function(link) {
            link.isOpen = false;
            link.hasSub = link.hasOwnProperty('subMenu');
            return link;
          })
          .value();

        $scope.fatmenuContent = [];
        $scope.fatmenuOpen = false;
        $scope.hideFatmenu = function() {
          if (!$scope.fatmenuOpen) {
            return;
          }
          $scope.fatmenuOpen = false;
          _.forEach($scope.primaryLinks, function(link) {
            link.isOpen = false;
          });
        };
        $scope.toggleFatmenu = function(link) {
          var wasOpen = link.isOpen;

          $scope.hideFatmenu();
          link.isOpen = !wasOpen;
          $scope.fatmenuOpen = !wasOpen;
          $scope.fatmenuContent = link.hasSub ? link.subMenu : [];
        };

        SessionService.isInRole(Role.STUDENT).then(function(isStudent) {
          if (!isStudent || !StateService.currentOrParentStateMatches(State.MY_STUDIES)) {
            return;
          }
          var optional = optionalLinks[Configuration.environment];

          SessionService.isInPilotDegreeProgramme().then(function(isInPilotProgramme) {
            if (isInPilotProgramme) {
              $scope.primaryLinks.unshift(optional.pilot);
            } else {
              $scope.primaryLinks.unshift(optional.normal);
            }
          });
        });

        $scope.selectedLanguage = LanguageService.getCurrent();
      }
    };
  });
