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

angular.module('directives.userMenu.settings.avatar', [
  'directives.imgLoad',
  'directives.uploadImage'
])

  .directive('avatar', function (userAvatarUpdatedEvent,
    UserSettingsService,
    AnalyticsService) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/header/userMenu/settings/userMenu.settings.avatar.html',
      link: function ($scope) {
        function reset() {
          $scope.resetMenu();
        }

        $scope.showAvatarChangeType = false;

        $scope.toggleChangeAvatar = function () {
          $scope.showAvatarChangeType = !$scope.showAvatarChangeType;
        };

        $scope.deleteUserAvatar = function () {
          UserSettingsService.deleteUserAvatar()
            .then(function deleteUserAvatarSuccess() {
              AnalyticsService.trackRemoveAvatar();
              $scope.$emit(userAvatarUpdatedEvent);
              $scope.resetMenu();
            });
        };

        $scope.upload = function (image, imageSourceMedia) {
          return UserSettingsService.updateUserAvatar(image).then(function () {
            AnalyticsService.trackAddAvatar(imageSourceMedia);
            reset();
            $scope.$emit(userAvatarUpdatedEvent);
          });
        };

        $scope.cancelUpload = function () {
          reset();
        };
      }
    };
  });
