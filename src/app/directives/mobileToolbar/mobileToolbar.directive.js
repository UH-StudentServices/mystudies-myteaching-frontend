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
  'constants.externalLinks',
  'services.state',
  'directives.logoutLink',
  'directives.stateChange',
  'directives.userMenu',
  'directives.mobileMenu'])

  .directive('mobileToolbar', function(StateChangeService,
                                       StateService,
                                       State,
                                       pageHeaderLinks,
                                       mobileReturnLinks,
                                       primaryLinks) {
    return {
      restrict : 'E',
      replace : true,
      templateUrl : 'app/directives/mobileToolbar/mobileToolbar.html',
      link : function($scope) {
        $scope.showToolbar = false;
        $scope.showShortcuts = false;
        $scope.showReturnLinks = false;
        $scope.changeRoleTo = null;

        $scope.toggleToolbar = function() {
          $scope.showToolbar = !$scope.showToolbar;
        };

        $scope.toggleShortcuts = function() {
          $scope.showShortcuts = !$scope.showShortcuts;
        };

        $scope.toggleReturnLinks = function() {
          $scope.showReturnLinks = !$scope.showReturnLinks;
        };

        StateChangeService.isStateChangeAvailable().then(function(stateChangeAvailable) {
          if(stateChangeAvailable) {
            $scope.changeStateTo = StateService.getRootStateName() === State.MY_STUDIES ? State.MY_TEACHINGS : State.MY_STUDIES;
          }
        });

        $scope.pageHeaderLinks = pageHeaderLinks;
        $scope.mobileReturnLinks = mobileReturnLinks;
        $scope.primaryLinks = primaryLinks;
      }
    }
  });