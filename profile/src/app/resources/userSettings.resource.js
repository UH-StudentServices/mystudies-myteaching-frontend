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

angular.module('resources.userSettings', [])

  .factory('UserSettingsResource', function ($resource) {
    var userSettingsResource = $resource('/api/private/v1/usersettings', null, {
      update: { method: 'POST' },
      updateUserAvatar: {
        url: '/api/private/v1/usersettings/avatar',
        method: 'POST'
      },
      deleteUserAvatar: {
        url: '/api/private/v1/usersettings/avatar',
        method: 'DELETE'
      }
    });

    var availableBackgroundImagesResource = $resource('/api/public/v1/images/backgrounds');

    var getUserSettings = function getUserSettings() {
      return userSettingsResource.get().$promise;
    };

    var getAvailableBackgrounds = function getAvailableBackgrounds() {
      return availableBackgroundImagesResource.query().$promise;
    };

    var updateUserSettings = function updateUserSettings(settings) {
      return userSettingsResource.update(settings).$promise;
    };

    var updateUserAvatar = function updateUserAvatar(id, imageBase64) {
      return userSettingsResource.updateUserAvatar({ id: id, imageBase64: imageBase64 }).$promise;
    };

    var deleteUserAvatar = function deleteUserAvatar(id) {
      return userSettingsResource.deleteUserAvatar({ id: id }).$promise;
    };

    return {
      getUserSettings: getUserSettings,
      getAvailableBackgrounds: getAvailableBackgrounds,
      updateUserSettings: updateUserSettings,
      updateUserAvatar: updateUserAvatar,
      deleteUserAvatar: deleteUserAvatar
    };
  });
