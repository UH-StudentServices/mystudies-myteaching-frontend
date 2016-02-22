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

angular.module('directives.userMenu.settings.avatar', ['directives.imgLoad',
                                                       'directives.uploadImage'])
  .constant('Camera', {
    START: 'START_WEBCAM',
    STOP: 'STOP_WEBCAM'
  })

  .directive('avatar', function($modal,
                                  userAvatarUpdatedEvent,
                                  startImageCropperEvent,
                                  Camera,
                                  UserSettingsService,
                                  BrowserUtil,
                                  ImageSourceMedia,
                                  AnalyticsService) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/header/userMenu/settings/userMenu.settings.avatar.html',
      link: function($scope) {

        function reset() {
          $scope.stopCamera();
          $scope.resetMenu();
        }

        $scope.showAvatarChangeType = false;

        $scope.toggleChangeAvatar = function() {
          $scope.showAvatarChangeType = !$scope.showAvatarChangeType;
        };

        $scope.supportsCamera = BrowserUtil.supportsCamera();

        $scope.deleteUserAvatar = function() {
          UserSettingsService.deleteUserAvatar()
            .then(function deleteUserAvatarSuccess() {
              AnalyticsService.trackRemoveAvatar();
              $scope.$emit(userAvatarUpdatedEvent);
              $scope.resetMenu();
            });
        };

        $scope.startCamera = function() {
          $scope.$broadcast(Camera.START);
        };

        $scope.stopCamera = function() {
          $scope.$broadcast(Camera.STOP);
          $scope.cameraOn = false;
        };

        $scope.takeSnapshot = function() {
          var videoElement = $scope.avatarChannel.video;

          $scope.$broadcast(startImageCropperEvent, videoElement, ImageSourceMedia.WEBCAM);
        };

        $scope.onStreaming = function() {
          $scope.cameraOn = true;
          $scope.$apply();
        };

        $scope.avatarChannel = {
          video: null // Will reference the video element on success
        };

        $scope.upload = function(image, imageSourceMedia) {
          return UserSettingsService.updateUserAvatar(image).then(function() {
            AnalyticsService.trackAddAvatar(imageSourceMedia);
            reset();
            $scope.$emit(userAvatarUpdatedEvent);
          });
        };

        $scope.cancelUpload = function() {
          reset();
        };
      }
    };
  });
