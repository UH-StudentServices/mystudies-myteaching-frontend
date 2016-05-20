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

angular.module('directives.userNotifications', [
  'resources.userNotifications',
  'dibari.angular-ellipsis'
])
  .directive('userNotifications', function(UserNotificationsResource, AnalyticsService) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/header/userMenu/userNotifications.html',
      scope: {},
      link: function($scope) {

        $scope.userNotifications = [];

        function getUnreadCount() {
          return _.filter($scope.userNotifications, {read: false}).length;
        }

        function getNotificationIds() {
          return _.pluck($scope.userNotifications, 'notificationId');
        }

        function loadUserNotifications() {
          UserNotificationsResource.getAll()
            .then(function userNotificationsGetAllSuccess(userNotifications) {
              $scope.userNotifications = userNotifications;
              $scope.unreadCount = getUnreadCount();
            });
        }

        loadUserNotifications();

        $scope.markRead = function() {
          if (getUnreadCount() > 0) {
            UserNotificationsResource.markRead(getNotificationIds())
              .then(function userNotificationsMarkReadSuccess() {
                AnalyticsService.trackNotificationMarkAsRead();
                $scope.unreadCount = 0;
              });
          }
        };
      }
    };
  });
