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

  .factory('UserSettingsService', function ($q,
    $cookies,
    UserSettingsResource) {
    var settingsPromise;
    var availableBackgroundsPromise;
    var Rx = window.Rx;
    var userSettingsSubject = new Rx.BehaviorSubject();

    var showBannerSubject = userSettingsSubject.map(function (userSettings) {
      return userSettings.showBanner;
    });

    function publishUserSettings(userSettings) {
      userSettingsSubject.onNext(userSettings);
      return userSettings;
    }

    function getUserSettings(forceRefresh) {
      if (!settingsPromise || forceRefresh) {
        settingsPromise = UserSettingsResource
          .getUserSettings()
          .then(publishUserSettings);
      }

      return settingsPromise;
    }

    function getAvailableBackgrounds() {
      if (!availableBackgroundsPromise) {
        availableBackgroundsPromise = UserSettingsResource.getAvailableBackgrounds();
      }
      return availableBackgroundsPromise;
    }

    function selectUserBackground(filename) {
      return getUserSettings().then(function (settings) {
        settingsPromise = UserSettingsResource.selectUserBackground(settings.id, filename)
          .then(publishUserSettings);
        return settingsPromise;
      });
    }

    function uploadUserBackground(imageBase64) {
      return getUserSettings().then(function (userSettings) {
        settingsPromise = UserSettingsResource.uploadUserBackground(userSettings.id, imageBase64)
          .then(publishUserSettings);
        return settingsPromise;
      });
    }

    function updateUserAvatar(imageBase64) {
      return getUserSettings().then(function (userSettings) {
        return UserSettingsResource.updateUserAvatar(userSettings.id, imageBase64);
      });
    }

    function deleteUserAvatar() {
      return getUserSettings().then(function (settings) {
        return UserSettingsResource.deleteUserAvatar(settings.id);
      });
    }

    function updateUserSettings(updateObject) {
      settingsPromise = getUserSettings()
        .then(function (settings) {
          return UserSettingsResource.updateUserSettings(_.assign(settings, updateObject));
        })
        .then(publishUserSettings);

      return settingsPromise;
    }

    function setShowBanner(showBanner) {
      return updateUserSettings({ showBanner: showBanner });
    }

    function getShowBannerSubject() {
      return showBannerSubject;
    }

    function acceptCookies() {
      return updateUserSettings({ cookieConsent: true });
    }

    return {
      acceptCookies: acceptCookies,
      getUserSettings: getUserSettings,
      getAvailableBackgrounds: getAvailableBackgrounds,
      selectUserBackground: selectUserBackground,
      uploadUserBackground: uploadUserBackground,
      updateUserAvatar: updateUserAvatar,
      deleteUserAvatar: deleteUserAvatar,
      setShowBanner: setShowBanner,
      getShowBannerSubject: getShowBannerSubject
    };
  });
