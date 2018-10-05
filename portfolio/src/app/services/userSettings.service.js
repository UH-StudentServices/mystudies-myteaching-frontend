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

angular.module('services.userSettings', ['resources.userSettings'])

  .factory('UserSettingsService', function (UserSettingsResource) {
    var userSettingsPromise;


    var settingsPromise;


    var availableBackgroundsPromise;


    var Rx = window.Rx;


    var userSettingsSubject = new Rx.BehaviorSubject();

    function publishUserSettings(userSettings) {
      userSettingsSubject.onNext(userSettings);
      return userSettings;
    }

    function getUserSettings() {
      if (!userSettingsPromise) {
        userSettingsPromise = UserSettingsResource.getUserSettings();
      }

      return userSettingsPromise;
    }

    function getAvailableBackgrounds() {
      if (!availableBackgroundsPromise) {
        availableBackgroundsPromise = UserSettingsResource.getAvailableBackgrounds();
      }
      return availableBackgroundsPromise;
    }

    function updateUserSettings(updateObject) {
      userSettingsPromise = getUserSettings()
        .then(function (settings) {
          return UserSettingsResource.updateUserSettings(_.assign(settings, updateObject));
        });

      return userSettingsPromise;
    }

    function acceptCookies() {
      return updateUserSettings({ cookieConsent: true });
    }

    function uploadUserBackground(imageBase64) {
      return getUserSettings().then(function (userSettings) {
        settingsPromise = UserSettingsResource.uploadUserBackground(userSettings.id, imageBase64)
          .then(publishUserSettings);
        return settingsPromise;
      });
    }

    return {
      acceptCookies: acceptCookies,
      getAvailableBackgrounds: getAvailableBackgrounds,
      getUserSettings: getUserSettings,
      updateUserSettings: updateUserSettings
    };
  });
