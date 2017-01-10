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
  'services.portfolio',
  'services.session',
  'directives.userMenu.settings.avatar',
  'webcam',
  'utils.browser',
  'directives.avatarImage',
  'directives.userName',
  'directives.visibility'
])
  .constant('userAvatarUpdatedEvent', 'USER_AVATAR_UPDATED_EVENT')

  .directive('settings', function($window,
                                  $rootScope,
                                  Upload,
                                  userAvatarUpdatedEvent,
                                  UserSettingsService,
                                  PortfolioService,
                                  SessionService,
                                  BrowserUtil
                                  ) {
    return {
      restrict: 'E',
      replace: true,
      scope: true,
      templateUrl: 'app/directives/header/userMenu/settings/userMenu.settings.html',
      link: function($scope) {

        $scope.showAvatarChangeType = false;
        $scope.cameraOn = false;
        $scope.supportsCamera = BrowserUtil.supportsCamera();

        SessionService.getSession().then(function getSessionSuccess(session) {
          $scope.session = session;
        });

        $scope.openPortfolio = function(role) {
          PortfolioService.getPortfolio(role).then(function getPortfolioSuccess(portfolio) {
            $window.location.href = portfolio.url;
          }, function getPortfolioFail(data) {
            if (data.status === 404) {
              PortfolioService.createPortfolio(role).then(function createPortfolioSuccess(portfolio) {
                $window.location.href = portfolio.url;
              });
            }
          });
        };

        $scope.resetMenu = function() {
          $scope.showAvatarChangeType = false;
          $scope.cameraOn = false;
          $scope.$broadcast('STOP_WEBCAM');
        };

        $scope.$on(userAvatarUpdatedEvent, function() {
          SessionService.getSession(true).then(function(session) {
            $scope.session.avatarUrl = session.avatarUrl + '?' + new Date().getTime();
          });
        });
      }
    };
  });

