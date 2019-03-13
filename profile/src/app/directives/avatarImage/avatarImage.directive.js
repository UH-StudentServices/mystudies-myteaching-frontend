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

angular.module('directives.avatarImage', ['services.profile'])
  .constant('userAvatarUpdatedEvent', 'USER_AVATAR_UPDATED_EVENT')
  .directive('avatarImage', function (userAvatarUpdatedEvent) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/avatarImage/avatarImage.html',
      scope: {},
      controller: function ($scope, ProfileService) {
        function refresh() {
          ProfileService.getProfile(true).then(function (profile) {
            $scope.avatarUrl = profile.avatarUrl + '?' + new Date().getTime();
            $scope.default = $scope.avatarUrl.indexOf('/api') === -1;
          });
        }

        $scope.$parent.$on(userAvatarUpdatedEvent, refresh);

        refresh();
      }
    };
  });
