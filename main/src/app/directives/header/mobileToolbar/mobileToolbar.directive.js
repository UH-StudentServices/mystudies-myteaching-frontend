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

angular.module('directives.mobileToolbar', [
  'constants.commonExternalLinks',
  'constants.externalLinks',
  'services.state',
  'services.configuration',
  'directives.logoutLink',
  'directives.userMenu',
  'directives.mobileMenu',
  'directives.visibility'])

  .directive('mobileToolbar', function(pageHeaderLinks,
                                       mobileReturnLinks,
                                       primaryLinks,
                                       LanguageService,
                                       $state,
                                       Configuration) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/header/mobileToolbar/mobileToolbar.html',
      link: function($scope) {
        $scope.showToolbar = false;
        $scope.showShortcuts = false;
        $scope.showReturnLinks = false;
        $scope.changeRoleTo = null;
        $scope.isLander = $state.includes('lander');

        $scope.toggleToolbar = function() {
          $scope.showToolbar = !$scope.showToolbar;
        };

        $scope.toggleShortcuts = function() {
          $scope.showShortcuts = !$scope.showShortcuts;
        };

        $scope.toggleReturnLinks = function() {
          $scope.showReturnLinks = !$scope.showReturnLinks;
        };

        $scope.pageHeaderLinks = pageHeaderLinks;
        $scope.mobileReturnLinks = mobileReturnLinks;
        $scope.primaryLinks = primaryLinks[Configuration.environment];
        $scope.selectedLanguage = LanguageService.getCurrent();
      }
    };
  });
