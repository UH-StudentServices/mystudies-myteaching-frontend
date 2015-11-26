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

angular.module('directives.toolbar', [
  'directives.userName',
  'resources.session',
  'services.session',
  'services.state',
  'directives.logoutLink',
  'directives.stateChange'
])

  .directive('toolbar', function($state, $filter, localStorageService, Role, State, SessionService, StateService, StateChangeService) {

    return {
      restrict: 'E',
      templateUrl: 'app/directives/toolbar/toolbar.html',
      link: function ($scope) {
        $scope.currentStateName = StateService.getRootStateName();
        $scope.State = State;

        $scope.stateOptions = [
          {
            stateName: State.MY_STUDIES,
            viewValue: $filter('translate')('opintoni.pageHeaderBranding')
          },
          {
            stateName: State.MY_TEACHINGS,
            viewValue: $filter('translate')('opetukseni.pageHeaderBranding')
          }
        ];

        SessionService.getSession().then(function getSessionSuccess(session) {
          $scope.session = session;
        });

        StateChangeService.isStateChangeAvailable().then(function(stateChangeAvailable) {
          $scope.stateChangeAvailable = stateChangeAvailable;
        })

        $scope.selectedState = _.find($scope.stateOptions, function(option) {
          return option.stateName === $scope.currentStateName;
        });
      }
    }
  });
