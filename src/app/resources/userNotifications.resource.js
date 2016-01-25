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

angular.module('resources.userNotifications', [])

  .factory('UserNotificationsResource', function($resource,
                                                 dateArrayToUTCMomentObject) {

    var userNotificationsPromise;

    var userNotificationsResource = $resource('/api/private/v1/usernotifications', {}, {
      markRead: {method: 'POST'}
    });

    function getAll() {
      if (!userNotificationsPromise) {
        userNotificationsPromise = userNotificationsResource.query().$promise.then(function(data) {
          return _.map(data, function(userNotification) {
            userNotification.timeFromNow = dateArrayToUTCMomentObject(userNotification.timestamp)
              .fromNow();

            return userNotification;
          });
        });
      }
      return userNotificationsPromise;
    }

    function markRead(notificationIds) {
      return userNotificationsResource.markRead(notificationIds).$promise;
    }

    return {
      getAll: getAll,
      markRead: markRead
    };
  });
