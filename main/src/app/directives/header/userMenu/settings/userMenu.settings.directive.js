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

angular.module('directives.userMenu.settings', [
  'uib/template/modal/window.html',
  'angular-flexslider',
  'services.userSettings',
  'services.profile',
  'services.session',
  'directives.userMenu.settings.avatar',
  'webcam',
  'utils.browser',
  'directives.avatarImage',
  'directives.userName',
  'directives.visibility'
])
  .constant('userAvatarUpdatedEvent', 'USER_AVATAR_UPDATED_EVENT')

  .directive('settings', function ($window,
    $rootScope,
    Upload,
    userAvatarUpdatedEvent,
    UserSettingsService,
    ProfileService,
    SessionService,
    BrowserUtil,
    Role) {
    return {
      restrict: 'E',
      replace: true,
      scope: true,
      templateUrl: 'app/directives/header/userMenu/settings/userMenu.settings.html',
      link: function ($scope) {
        $scope.showAvatarChangeType = false;
        $scope.cameraOn = false;
        $scope.supportsCamera = BrowserUtil.supportsCamera();
        $scope.roles = {
          teacher: Role.TEACHER,
          student: Role.STUDENT
        };

        SessionService.getSession().then(function getSessionSuccess(session) {
          $scope.session = session;
        });

        $scope.openProfile = function (role) {
          ProfileService.getProfile(role).then(function getProfileSuccess(profile) {
            $window.location.href = profile.url;
          }).catch(function getProfileFail(data) {
            if (data.status === 404) {
              ProfileService.createProfile(role)
                .then(function createProfileSuccess(profile) {
                  $window.location.href = profile.url;
                });
            }
          });
        };

        $scope.resetMenu = function () {
          $scope.showAvatarChangeType = false;
          $scope.cameraOn = false;
          $scope.$broadcast('STOP_WEBCAM');
        };

        $scope.$on(userAvatarUpdatedEvent, function () {
          SessionService.getSession(true).then(function (session) {
            $scope.session.avatarUrl = session.avatarUrl + '?' + new Date().getTime();
          });
        });
      }
    };
  });
