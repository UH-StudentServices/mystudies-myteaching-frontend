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

angular.module('directives.avatarImage', ['services.state'])
  .directive('avatarImage', function(StateService, State) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/header/userMenu/avatarImage.html',
      scope: {
        imgSrc: '=',
        imgAlt: '='
      },
      link: function($scope) {
        $scope.isTeacher = StateService.getRootStateName() === State.MY_TEACHINGS;

        $scope.isDefault = function() {
          return $scope.imgSrc.indexOf('/api') === -1;
        };
      }
    }
  });